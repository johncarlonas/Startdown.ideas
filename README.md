# Startdown.ideas

Startdown.ideas is a satirical, brutalist web application where users submit startup ideas and receive a ruthless AI review. It runs as a Vite React frontend plus a Node.js/Express API on Vercel.

## Deployment

The deployment walkthrough is in [deployment/README.md](./deployment/README.md).

Set the Vercel project root directory to `startdown`, then add the variables from [startdown/.env.example](./startdown/.env.example). The Redis variables come from a Vercel Marketplace Upstash Redis integration.

The repository still contains the earlier Azure architecture screenshots and reports as project history. They are not used by the application or deployment.

## Runtime design

- Vercel serves the built Vite frontend and runs the Express API as a Node.js Function.
- Upstash Redis stores the Wall of Shame as a durable list. `LPUSH` keeps new posts first, matching the previous UI ordering.
- Local development keeps using `server/db.json` so the project can run without a cloud database.
- Groq and Redis credentials stay in server-side environment variables and never enter the browser bundle.

## Technical stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, Vanilla CSS |
| **Backend** | Node.js, Express, Vercel Functions |
| **AI Engine** | Groq API (Llama 3.3-70b) |
| **Database** | Upstash Redis (Vercel Marketplace) |
| **Secrets** | Vercel Environment Variables |
| **Monitoring** | Vercel Observability |

## Local development

```powershell
cd startdown
npm install
Copy-Item .env.example .env
# Add a real GROQ_API_KEY to .env
npm run build
npm start
```

Run the Vite development server in a second terminal with `npm run dev`. It proxies `/api` requests to the Node server on port 3000.

## Repository structure

```text
Startdown/
├── startdown/api/       # Vercel Function entry point
├── startdown/server/    # Node.js/Express API and local database fallback
├── startdown/src/       # React frontend
├── deployment/          # Vercel deployment guide
└── .github/workflows/   # Build checks
```
