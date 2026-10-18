
<div align="center">

<h1>Startdown.ideas</h1>

<p><b>Where Startup Ideas Get Brutally Honest AI Feedback</b></p>

<p>
  A satirical, brutalist web application where users submit startup ideas and receive ruthless AI-generated reviews, combining humor with generative AI and community interaction.
</p>

<p>
  Developed as a Cloud Computing course project, initially deployed on Microsoft Azure to explore cloud infrastructure, application hosting, database services, and cloud-based deployment.
</p>

<p>
  <img src="https://img.shields.io/badge/REACT-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/VITE-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/EXPRESS-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/GROQ-F55036?style=for-the-badge" alt="Groq" />
  <img src="https://img.shields.io/badge/REDIS-FF4438?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/AZURE-0078D4?style=for-the-badge" alt="Microsoft Azure" />
</p>

<p>
  <a href="https://startdown-ideas.vercel.app/"><b>Live Application</b></a>
</p>

</div>

---

## Overview

Startdown.ideas is a satirical, brutalist web application where users submit startup ideas and receive a ruthless AI review. It runs as a Vite React frontend plus a Node.js/Express API on Vercel.

## Deployment

The deployment walkthrough is in [deployment/README.md](./deployment/README.md).

Set the Vercel project root directory to `startdown`, then add the variables from [startdown/.env.example](./startdown/.env.example). The Redis variables come from a Vercel Marketplace Upstash Redis integration.

The repository still contains the earlier Azure architecture screenshots and reports as project history. They are not used by the application or deployment.

## Runtime design

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
