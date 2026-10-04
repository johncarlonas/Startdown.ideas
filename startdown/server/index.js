import express from 'express';
import { createGuardrails } from './guardrails.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '8kb' }));
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('X-Content-Type-Options', 'nosniff');
  if (req.method === 'POST' && req.headers.origin) {
    try {
      const origin = new URL(req.headers.origin);
      const sameHost = origin.host === req.headers.host;
      const localDev = process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'production'
        && ['localhost', '127.0.0.1'].includes(origin.hostname);
      if (!sameHost && !localDev) return res.status(403).json({ error: 'Cross-site requests are not allowed.' });
    } catch { return res.status(403).json({ error: 'Invalid origin.' }); }
  }
  next();
});

const PORT = process.env.PORT || 3000;
const IS_LOCAL = process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1';
const DB_PATH = path.join(__dirname, 'db.json');
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const WALL_KEY = process.env.REDIS_WALL_KEY || 'startdown:wall';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

// State for clients
let groqClient;
let localDb = [];
let servicesPromise;

async function redisCommand(command) {
  if (!REDIS_URL || !REDIS_TOKEN) {
    throw new Error('Upstash Redis URL and token environment variables are required in production.');
  }

  const response = await fetch(REDIS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify(command)
  });
  const payload = await response.json();

  if (!response.ok || payload.error) {
    throw new Error(payload.error || `Redis request failed with status ${response.status}.`);
  }

  return payload.result;
}

async function initializeServices() {
  const groqKey = process.env.GROQ_API_KEY;

  if (!groqKey) {
    throw new Error('GROQ_API_KEY is missing.');
  }

  if (IS_LOCAL) {
    console.log('🛠 Running in DEVELOPMENT mode (local JSON database + Groq)');
    try {
      const data = await fs.readFile(DB_PATH, 'utf8');
      localDb = JSON.parse(data);
      if (!Array.isArray(localDb)) throw new Error('Local wall database must be an array.');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      await fs.writeFile(DB_PATH, JSON.stringify([]));
    }
  } else {
    if (!REDIS_URL || !REDIS_TOKEN) {
      throw new Error('Upstash Redis environment variables are missing.');
    }
    console.log('🚀 Running in Vercel mode (Upstash Redis + Groq)');
  }

  groqClient = new OpenAI({
    apiKey: groqKey,
    baseURL: 'https://api.groq.com/openai/v1',
    maxRetries: 0,
    timeout: 25000,
    fetch: (...args) => globalThis.fetch(...args)
  });

  console.log('✅ Groq services initialized successfully.');
}

function ensureServices() {
  servicesPromise ??= initializeServices();
  return servicesPromise;
}

app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api/')) return next();

  try {
    await ensureServices();
    next();
  } catch (err) {
    console.error('Service initialization failed:', err.name);
    res.status(503).json({ error: 'The roast engine is not configured yet.' });
  }
});


const guards = createGuardrails({ local: IS_LOCAL, redis: redisCommand, prefix: WALL_KEY,
  saveLocal: async (item) => {
    const updated = [item, ...localDb];
    await fs.writeFile(DB_PATH, JSON.stringify(updated, null, 2));
    localDb = updated;
  }
});
function setting(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value < 1 || value > 100000) throw new Error(`Invalid ${name}`);
  return value;
}
const roastLimits = [
  ['roast-minute', setting('ROASTS_PER_MINUTE', 3), 60],
  ['roast-day', setting('ROASTS_PER_DAY', 10), 86400],
  ['roast-site-day', setting('ROASTS_SITE_PER_DAY', 100), 86400, true]
];
async function enforceLimit(req, res, rules) {
  const ip = process.env.VERCEL === '1'
    ? String(req.headers['x-forwarded-for'] || req.socket.remoteAddress).split(',')[0].trim()
    : req.socket.remoteAddress || 'local';
  const retry = await guards.limit(ip, rules);
  if (!retry) return true;
  res.set('Retry-After', String(retry));
  res.status(429).json({ error: `Usage limit reached. Try again in ${retry} seconds.` });
  return false;
}
function validateRoast(value) {
  const result = {};
  for (const field of ['verdictBadge', 'roastText', 'feasNote', 'marketNote', 'origNote']) {
    if (typeof value[field] !== 'string' || !value[field].trim() || value[field].length > 3000) throw new Error('Invalid AI output');
    result[field] = value[field];
  }
  if (!['ember', 'hazard', 'acid'].includes(value.badgeColor)) throw new Error('Invalid AI color');
  result.badgeColor = value.badgeColor;
  for (const field of ['feasScore', 'marketScore', 'origScore']) {
    if (!Number.isFinite(value[field]) || value[field] < 1 || value[field] > 100) throw new Error('Invalid AI score');
    result[field] = value[field];
  }
  if (!Array.isArray(value.advice) || value.advice.length !== 3) throw new Error('Invalid AI advice');
  result.advice = value.advice.map(({ type, text, color }) => {
    if (typeof type !== 'string' || type.length > 40 || typeof text !== 'string' || text.length > 1000 || !['ember', 'hazard', 'acid'].includes(color)) throw new Error('Invalid AI advice');
    return { type, text, color };
  });
  return result;
}

app.post('/api/roast', async (req, res) => {
  const idea = typeof req.body?.idea === 'string' ? req.body.idea.trim() : '';
  if (idea.length < 10 || idea.length > 1000) return res.status(400).json({ error: 'Describe your idea in 10–1000 characters.' });

  try {
    if (!await enforceLimit(req, res, roastLimits)) return;
    const completion = await groqClient.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: `You are a ruthless, cynical, high-tier Silicon Valley Venture Capitalist evaluating startup ideas for 'Startdown.ideas'. 

TONE GUIDELINES:
- IF THE IDEA IS TRASH: Completely crush their dreams with clinical, sarcastic, and devastating logic. Mock their unearned confidence.
- IF THE IDEA IS ACTUALLY GOOD: Be grudgingly impressed. Use backhanded compliments. Admit the math works, but warn them not to screw it up. Sound surprised that a 'bottom-tier founder' actually had a brain cell.

CRITICAL RULES:
- NO PROFANITY: Be hurtful and brutal, but do not swear. Use devastating metaphors.
- BE DYNAMIC: Vary your roasts. Attack tech, marketing, or the founder's intelligence.
- OUTPUT FORMAT: Respond ONLY with a valid JSON object.

REQUIRED JSON STRUCTURE:
{
  "verdictBadge": "Aggressive summary (e.g., 'ECONOMIC SUICIDE', 'ACTUALLY... OK?', 'VIBE NONSENSE')",
  "badgeColor": "ember" (trash), "hazard" (mediocre), or "acid" (actually good),
  "roastText": "3-5 sentence brutal or backhanded review.",
  "feasScore": number (1-100),
  "feasNote": "Sarcastic 1-sentence note (max 8 words)",
  "marketScore": number (1-100),
  "marketNote": "Sarcastic 1-sentence note (max 8 words)",
  "origScore": number (1-100),
  "origNote": "Sarcastic 1-sentence note (max 8 words)",
  "advice": [
    { "type": "PIVOT", "text": "1-sentence tip", "color": "hazard" },
    { "type": "SURVIVE", "text": "1-sentence tip", "color": "ember" },
    { "type": "COPE", "text": "1-sentence tip", "color": "acid" }
  ]
}`
        },
        { role: "user", content: idea }
      ],
      max_completion_tokens: 2000,
      ...(GROQ_MODEL.startsWith('openai/gpt-oss-') ? { reasoning_effort: 'low' } : {}),
      response_format: { type: "json_object" }
    });

    const roast = validateRoast(JSON.parse(completion.choices[0].message.content));
    const shareToken = await guards.issue({ ...roast, idea, id: crypto.randomUUID(), timestamp: new Date().toISOString(), is_posted: true });
    res.json({ ...roast, shareToken });
  } catch (err) {
    console.error('Roast request failed:', err.status || err.name);
    res.status(500).json({ error: 'Groq is too disgusted by your idea to respond.' });
  }
});

app.post('/api/save', async (req, res) => {
  const token = req.body?.shareToken;
  if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return res.status(400).json({ error: 'Generate a verdict before sharing it.' });
  try {
    if (!await enforceLimit(req, res, [['save-minute', 20, 60]])) return;
    const result = await guards.share(token);
    if (result < 0) return res.status(410).json({ error: 'This verdict expired. Generate a new one to share.' });
    res.json({ success: true, alreadyShared: result === 0 });
  } catch {
    res.status(503).json({ error: 'Unable to share right now. Please try again.' });
  }
});

app.get('/api/wall', async (req, res) => {
  const offset = Number(req.query.offset ?? 0);
  const limit = Number(req.query.limit ?? 12);
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000 || !Number.isSafeInteger(limit) || limit < 1 || limit > 30) return res.status(400).json({ error: 'Invalid page.' });
  try {
    if (!await enforceLimit(req, res, [['wall-minute', 60, 60]])) return;
    const items = IS_LOCAL ? localDb.slice(offset, offset + limit + 1)
      : (await redisCommand(['LRANGE', WALL_KEY, offset, offset + limit])).map(value => JSON.parse(value));
    res.json({ roasts: items.slice(0, limit), hasMore: items.length > limit, nextOffset: offset + Math.min(items.length, limit) });
  } catch {
    res.status(503).json({ error: 'Unable to load the wall right now.' });
  }
});
app.use('/api', (req, res) => res.status(404).json({ error: 'Unknown endpoint.' }));
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(err.type === 'entity.too.large' ? 413 : 400).json({ error: 'Invalid request body.' });
});

// Vercel serves the Vite build from its CDN. Keep static serving for local
// `npm start` after a production build.
if (process.env.VERCEL !== '1') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

if (process.env.VERCEL !== '1' && process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  ensureServices()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Startdown server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('❌ Failed to initialize services:', err);
      process.exitCode = 1;
    });
}

export default app;
