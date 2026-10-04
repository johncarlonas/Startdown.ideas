# Changelog

All notable changes to this project will be documented in this file.

## [2026-10-04] - Vercel Migration

### Changed
- Removed Azure Cosmos DB, Key Vault, Managed Identity, and Application Insights from the runtime.
- Moved production Wall of Shame persistence to an Upstash Redis list accessed over HTTPS.
- Added a Vercel Function entry point and deployment configuration for the Vite frontend.
- Removed the Azure App Service deployment workflow.
- Updated the Groq model after `llama-3.3-70b-versatile` was deprecated.

## [2026-04-25] - UI/UX Prototype

### Added
- `John Carlo Nas` Built out the brutalist UI design system — color palette, typography, and core component layouts.
- `John Carlo Nas` Set up the static React frontend with mock data, ready for backend wiring.

## [2026-04-26] - Initial Azure Foundation

### Added
- `John Carlo Nas` Created `README.md` and `CHANGELOG.md` based on rubric requirements.
- `John Carlo Nas` Created the primary Resource Group (`rg-csec3-final-project`) on Azure Portal.

## [2026-05-06] - Data Layer

### Added
- `John Carlo Nas` Set up Resource Group in Japan East.
- `John Carlo Nas` Deployed Cosmos DB for NoSQL (`startdown-ideas`) in Serverless mode.

### Changed
- `John Carlo Nas` Opened Cosmos DB firewall to "All networks" for testing.

## [2026-05-08] - Compute & Security

### Added
- `John Carlo Nas` Deployed Key Vault (`kv-startdown-ideas`) with RBAC.
- `John Carlo Nas` Provisioned App Service Plan (`startdown-ideas`) on B1 tier in Japan East.
- `John Carlo Nas` Set instance count to 2 for HA.

### Fixed
- `John Carlo Nas` Got past `RequestDisallowedByAzure` blocks by switching to B1 tier in Japan East.

## [2026-05-10] - App Hosting & Scaling

### Added
- `John Carlo Nas` Deployed App Service (Web App) on Node 22 LTS, linked to the B1 plan.
- `John Carlo Nas` Set up App Service Environment Variables for Key Vault access.
- `John Carlo Nas` Drafted the Cloud Architecture Diagram.
- `John Carlo Nas` Generated the Cost Estimate via Azure Pricing Calculator.

### Changed
- `John Carlo Nas` Dropped Static Web Apps, moved fully to App Service (B1) due to policy blocks.

### Fixed
- `John Carlo Nas` Hit Error 429 (API throttling) during rapid deployments — slowed down provisioning to fix it.

## [2026-05-11] - Architecture Finalization

### Added
- `John Carlo Nas` Finalized `architecture.png` — covers network boundaries, scaling, and cost optimizations.
- `John Carlo Nas` Generated Groq API credentials and prepped them for Key Vault injection.

## [2026-05-12] - AI Engine & Deployment

### Added
- `John Carlo Nas` Built the Node.js/Express backend (`server/`) as the bridge between the frontend and Azure.
- `John Carlo Nas` Wired up `@azure/identity` and `@azure/keyvault-secrets` for passwordless secret fetching.
- `John Carlo Nas` Integrated `@azure/cosmos` SDK for Cosmos DB read/write on the Wall of Shame.
- `John Carlo Nas` Finished the AI Roast Engine using Groq (Llama 3.3) with a full brutalist UI.
- `John Carlo Nas` Added GitHub Actions CI (`ci.yml`) for automated frontend builds and backend checks.
- `John Carlo Nas` Wrote out the full deployment guide (`deployment/README.md`) with GUI walkthrough.
- `John Carlo Nas` Finalized the Cost Estimate report (`report/cost-estimate.md`).
- `John Carlo Nas` Added 20+ screenshots across all docs for rubric evidence.
- `John Carlo Nas` Migrated API keys to Key Vault with RBAC (Secrets Officer + Secrets User).
- `John Carlo Nas` Created the `shame-wall` container in Cosmos DB (`StartdownDB`).
- `John Carlo Nas` Added App Service Environment Variables pointing to Key Vault secrets.
- `John Carlo Nas` Linked GitHub repo to App Service and pushed the final production deploy.

### Changed
- `John Carlo Nas` Replaced mock data in `RoastInput.jsx` and `WallOfShame.jsx` with live `/api/roast` and `/api/wall` calls.
- `John Carlo Nas` Backend now toggles between local `db.json` and Cosmos DB based on `NODE_ENV`.
- `John Carlo Nas` Rewrote `deployment/README.md` — reorganized into tables, switched images to clickable links.

### Fixed
- `John Carlo Nas` Fixed Cosmos DB IDs in `server/index.js` to match the actual provisioned names (`StartdownDB` / `shame-wall`).
- `John Carlo Nas` Fixed the UI inconsistency by enforcing 3-line truncation with ellipsis for both roast summaries and original ideas on the Wall of Shame.
- `John Carlo Nas` Integrated **Azure Application Insights** for deep-level monitoring, tracking request telemetry and performance metrics.
- `John Carlo Nas` Updated all project documentation (README, Architecture, Report) to reflect the shift from basic monitoring to full observability.
