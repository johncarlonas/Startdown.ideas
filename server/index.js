import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { CosmosClient } from '@azure/cosmos';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const KEY_VAULT_URL = process.env.KEY_VAULT_URL || 'https://kv-startdown-ideas.vault.azure.net/';
const DB_PATH = path.join(__dirname, 'db.json');

// State for clients
let groqClient;
let cosmosContainer; 
let localDb = []; 

// 1. Initialize Services
async function initializeServices() {
  try {
    let groqKey;

    if (NODE_ENV === 'development') {
      console.log('🛠 Running in DEVELOPMENT mode (Local DB + Groq)');
      groqKey = process.env.GROQ_API_KEY;
      
      try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        localDb = JSON.parse(data);
      } catch (err) {
        await fs.writeFile(DB_PATH, JSON.stringify([]));
      }
    } else {
      console.log('🚀 Running in PRODUCTION mode (Azure Cloud)');
      const credential = new DefaultAzureCredential();
      const secretClient = new SecretClient(KEY_VAULT_URL, credential);
      
      const groqSecret = await secretClient.getSecret('GROQ-API-KEY');
      const cosmosSecret = await secretClient.getSecret('COSMOS-CONNECTION-STRING');
      groqKey = groqSecret.value;
      
      const cosmosClient = new CosmosClient(cosmosSecret.value);
      const { database } = await cosmosClient.databases.createIfNotExists({ id: 'startdown' });
      const { container } = await database.containers.createIfNotExists({ id: 'roasts' });
      cosmosContainer = container;
    }

    if (!groqKey) throw new Error('GROQ_API_KEY is missing!');
    
    // Initialize Groq (using OpenAI SDK because it's compatible)
    groqClient = new OpenAI({ 
      apiKey: groqKey,
      baseURL: "https://api.groq.com/openai/v1"
    });
    
    console.log('✅ Groq Services initialized successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize services:', err);
  }
}

// 2. API Routes

app.post('/api/roast', async (req, res) => {
  const { idea } = req.body;
  if (!idea) return res.status(400).json({ error: 'Idea is required' });

  try {
    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
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
      response_format: { type: "json_object" }
    });

    const roast = JSON.parse(completion.choices[0].message.content);
    res.json(roast);
  } catch (err) {
    console.error('Groq Error:', err);
    res.status(500).json({ error: 'Groq is too disgusted by your idea to respond.' });
  }
});

app.post('/api/save', async (req, res) => {
  const roastData = req.body;
  try {
    const item = {
      ...roastData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      is_posted: true
    };

    if (NODE_ENV === 'development') {
      localDb.unshift(item);
      await fs.writeFile(DB_PATH, JSON.stringify(localDb, null, 2));
    } else {
      await cosmosContainer.items.create(item);
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error('Save Error:', err);
    res.status(500).json({ error: 'Failed to post to the Wall of Shame.' });
  }
});

app.get('/api/wall', async (req, res) => {
  try {
    if (NODE_ENV === 'development') {
      res.json(localDb);
    } else {
      const { resources } = await cosmosContainer.items
        .query("SELECT * FROM c WHERE c.is_posted = true ORDER BY c.timestamp DESC")
        .fetchAll();
      res.json(resources);
    }
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch the Wall of Shame.' });
  }
});

// 3. Static Serving
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

initializeServices().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Startdown server running on port ${PORT}`);
  });
});
