# Changelog

All notable changes to this project will be documented in this file.

## [2026-04-25]

### Added

- `John Carlo Nas` Finalized the Brutalist UI/UX design system, including the custom color palette and component layouts.
- `John Carlo Nas` Developed the static React.js frontend, ensuring UI components and mock data structures are ready for Azure backend integration.

## [2026-04-26]

### Added

- `John Carlo Nas` Created master `README.md` and `CHANGELOG.md` documentation templates adhering to project rubric requirements.
- `John Carlo Nas` Provisioned the foundational Azure infrastructure by creating the primary Resource Group (`rg-csec3-final-project`) in the Azure Portal.

## [2026-05-06]

### Added

- `John Carlo Nas` Initialized the project Resource Group `rg-csec3-final-project` in Japan East.
- `John Carlo Nas` Deployed Azure Cosmos DB for NoSQL (`startdown-ideas`) in Serverless mode for cost-optimized data persistence.

### Changed

- `John Carlo Nas` Adjusted Cosmos DB firewall to "All networks" to prepare for cross-service communication testing.

## [2026-05-08]

### Added

- `John Carlo Nas` Deployed Azure Key Vault (`kv-startdown-ideas`) using RBAC for secure secret management.
- `John Carlo Nas` Successfully provisioned the Core Compute layer via **App Service Plan** (`startdown-ideas`) in Japan East.
- `John Carlo Nas` Configured Compute scaling to **2 instances** to satisfy High Availability (HA) requirements.

### Fixed

- `John Carlo Nas` Resolved `RequestDisallowedByAzure` policy blocks by successfully validating the B1 Pricing Tier within the Japan East region, bypassing previous regional compute-quota limitations.

## [2026-05-10]

### Added

- `John Carlo Nas` Provisioned Azure App Service (Web App) using the Node 22 LTS runtime stack, attaching it to the validated B1 App Service Plan.
- `John Carlo Nas` Configured App Service Environment Variables to prepare for secure secret fetching from Azure Key Vault.
- `John Carlo Nas` Drafted the final Cloud Architecture Diagram highlighting the security boundaries, scaling rules (2 instances), and serverless components.
- `John Carlo Nas` Generated the Cost Estimate Report using the Azure Pricing Calculator to validate the cost-optimization strategy of the B1 and Serverless tiers.

### Changed

- `John Carlo Nas` Pivoted final compute architecture entirely to App Service (B1) after abandoning the Static Web App approach due to persistent tenant-level policy compliance blocks.

### Fixed

- `John Carlo Nas` Navigated API Throttling (Error 429) during rapid infrastructure deployments by pacing resource provisioning and successfully validating the final Web App container.

## [2026-05-11]

### Added
- `John Carlo Nas` Designed and finalized the Cloud Architecture Diagram (`architecture.png`), clearly defining the private network security boundaries, scaling configurations (2 instances), and cost optimizations (Serverless DB).
- `John Carlo Nas` Generated standard Groq API credentials and prepared them for secure injection into Azure Key Vault, finalizing the hybrid external-API security approach to bypass student subscription limits.

## [2026-05-12]

### Added
- `John Carlo Nas` Initialized the Node.js/Express backend server (`server/` directory) to serve as the integration layer between the React frontend and Azure services.
- `John Carlo Nas` Implemented `@azure/identity` (`DefaultAzureCredential`) and `@azure/keyvault-secrets` locally to securely fetch the OpenAI API key without hardcoding credentials.
- `John Carlo Nas` Integrated the `@azure/cosmos` SDK into the backend to handle real-time NoSQL read/write operations for the "Wall of Shame" feature.
- `John Carlo Nas` Finalized the "Startdown AI Engine" with Groq (Llama 3.3) integration, a brutalist responsive UI, and a dedicated Wall of Shame expansion system.
- `John Carlo Nas` Configured GitHub Actions CI workflow (`ci.yml`) to automate frontend builds and backend dependency validation.

### Changed
- `John Carlo Nas` Refactored frontend React components (`RoastInput.jsx` and `WallOfShame.jsx`) to replace static mock data with dynamic `fetch()` calls to the new local API routes (`/api/roast` and `/api/wall`).