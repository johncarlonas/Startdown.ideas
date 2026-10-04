# Vercel Deployment Guide

This project is deployed as a Vite frontend and a Node.js/Express Vercel Function. Azure Cosmos DB, Azure Key Vault, Managed Identity, and Application Insights are no longer used by the runtime.

## 1. Create the Redis database

In the Vercel project, open **Integrations → Marketplace** and add an Upstash Redis integration. Link the new database to the project. The integration provides:

- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or the integration's `KV_REST_API_URL` and `KV_REST_API_TOKEN` names)

The app stores each Wall of Shame entry as one JSON string in the `startdown:wall` Redis list. New entries are pushed to the front, and the API reads the list in that same order.

## 2. Import the repository

1. Import the Git repository at [vercel.com/new](https://vercel.com/new).
2. Set **Root Directory** to `startdown`.
3. Keep the Vite framework preset.
4. Keep the build command as `npm run build` and the output directory as `dist`.
5. Deploy after adding the environment variables below.

The `startdown/vercel.json` file routes `/api/*` to the Express function and all other paths to the Vite SPA entry point.

## 3. Add environment variables

Add these in **Project Settings → Environment Variables** for Preview and Production:

| Name | Purpose |
| :--- | :--- |
| `GROQ_API_KEY` | Server-side Groq API credential |
| `GROQ_MODEL` | Optional Groq model ID; defaults to `openai/gpt-oss-120b` |
| `UPSTASH_REDIS_REST_URL` or `KV_REST_API_URL` | Upstash REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_TOKEN` | Upstash REST credential |
| `REDIS_WALL_KEY` | Optional Redis list name; defaults to `startdown:wall` |
| `ROASTS_PER_MINUTE` | Optional maximum requests per IP per rolling minute; defaults to `3` |
| `ROASTS_PER_DAY` | Optional maximum requests per IP per rolling 24 hours; defaults to `10` |
| `ROASTS_SITE_PER_DAY` | Optional maximum requests across the site per rolling 24 hours; defaults to `100` |

Do not prefix these variables with `VITE_`; that would expose them to browser code.

The defaults apply without adding these optional limit variables. Redis enforces the production limits atomically across Vercel instances. If Redis is unavailable, generation stops before calling Groq. Failed generation attempts count toward the limits; automatic Groq retries are disabled, input is limited to 1000 characters, and output is capped at 2000 tokens per request. These are request and token ceilings, not a dollar billing cap. Per-IP limits can affect people sharing a network; the site-wide ceiling remains in place if someone changes their IP.

Local development uses in-memory limits, which reset when the backend restarts. Production requires real Redis credentials; leave no placeholder credentials in Vercel. Keep the same Redis database and wall key across instances to share the counters.

Only server-generated verdicts can be shared. A verdict's share token expires after 24 hours, and repeat submissions of the same token cannot create additional wall entries. The homepage shows the newest three entries; `/wall-of-shame` displays paginated entries. Restart the local backend after pulling these changes so it uses the new API contract and protections.

## 4. Verify the deployment

After the first deployment:

1. Open the site and submit an idea.
2. Confirm the roast is returned by `/api/roast`.
3. Share the roast and refresh the page.
4. Confirm it appears in the Wall of Shame from `/api/wall`.
5. Check the Vercel function logs if either API request returns an error.
6. Confirm both the navbar and home “Show more” link open `/wall-of-shame`, and refresh that page directly.
7. Confirm a shared verdict's button becomes disabled and a repeated share request creates no duplicate.

Vercel Functions run on Node.js by default. The API does not write to the local filesystem in production; `server/db.json` is only the development fallback.

## Existing Azure data

The application no longer reads Cosmos DB. Existing Cosmos records will not appear in the new Redis list automatically. If those records matter, export them from Cosmos before deleting the Azure account and import the JSON objects into the Upstash `startdown:wall` list once.
