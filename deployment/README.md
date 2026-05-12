# Deployment Documentation (GUI Method)

This repository utilizes **Method B (GUI)** for infrastructure deployment. This document provides a detailed, sequential walkthrough of the provisioning process within the Azure Portal, ensuring a secure, scalable, and cost-optimized environment for the **Startdown.ideas** platform.

---

## 1. Resource Mapping & Requirements

The following table maps deployed infrastructure to the core requirements of the project rubric:

| Requirement | Azure Resource Name | Specification |
| :--- | :--- | :--- |
| **1. Resource Group** | `rg-csec3-final-project` | Logical boundary and management container in Japan East. |
| **2. Core Compute** | `startdown-ideas` (App Service) | B1 Tier, scaled to **2 Instances** for High Availability. |
| **3. Data Resource** | `startdown-ideas` (Cosmos DB) | NoSQL Serverless mode for cost-efficiency and JSON flexibility. |
| **4. Security Control** | `kv-startdown-ideas` (Key Vault) | Secured via Managed Identity and **RBAC** (Passwordless). |

---

## 2. Detailed Provisioning Steps

### Phase 1: Resource Group Foundation

Established a primary Resource Group named `rg-csec3-final-project` as the logical container and security boundary for all project assets. Provisioned in the **Japan East** region to ensure high availability and bypass regional subscription locks.

| Step | Screenshot |
| :--- | :--- |
| Configuring resource group basics | [View Photo](screenshots/resource_group/rg-basics.png) |
| Adding resource tags | [View Photo](screenshots/resource_group/rg-tags.png) |
| Reviewing RG settings | [View Photo](screenshots/resource_group/rg-review.png) |
| Resource group successfully deployed | [View Photo](screenshots/resource_group/rg-deployed.png) |

---

### Phase 2: Data Layer (Azure Cosmos DB)

Deployed an Azure Cosmos DB account (`startdown-ideas`) in **Serverless capacity mode** to eliminate idle costs. The serverless model charges only for Request Units (RUs) consumed during active operations — ideal for variable startup traffic. The database (`StartdownDB`) and container (`shame-wall`) were created for storing roast JSON objects.

| Step | Screenshot |
| :--- | :--- |
| Initializing the NoSQL account | [View Photo](screenshots/cosmos_db/cd-basics.png) |
| Configuring connectivity | [View Photo](screenshots/cosmos_db/cd-networking.png) |
| Setting retention/backup policy | [View Photo](screenshots/cosmos_db/cd-backup-policy.png) |
| Regional distribution settings | [View Photo](screenshots/cosmos_db/cd-global-dist.png) |
| Pre-deployment validation | [View Photo](screenshots/cosmos_db/cd-review.png) |
| Successful deployment confirmation | [View Photo](screenshots/cosmos_db/cd-success.png) |
| Creating the `shame-wall` container | [View Photo](screenshots/cosmos_db/cd-container-creation.png) |
| Extracting connection string for Key Vault | [View Photo](screenshots/cosmos_db/cd-keys-extraction.png) |

---

### Phase 3: Compute Infrastructure (App Service Plan)

Provisioned an Azure App Service Plan (`startdown-ideas`) on the **Basic (B1)** tier. This plan supports **Manual Scale-out**, allowing the infrastructure to run on **2 instances** for load balancing and high availability.

| Step | Screenshot |
| :--- | :--- |
| Configuring the Linux plan | [View Photo](screenshots/app_service_plan/asp-basics.png) |
| Reviewing compute resources | [View Photo](screenshots/app_service_plan/asp-review.png) |
| Plan creation successful | [View Photo](screenshots/app_service_plan/asp-success.png) |

---

### Phase 4: Application Hosting (App Service)

Deployed the Azure App Service (`startdown-ideas`) as the primary hosting environment for the Node.js backend and React frontend (Node 22 LTS runtime). Configured with a **System-Assigned Managed Identity** to enable passwordless access to Azure Key Vault, and populated **Environment Variables** to bridge the app with production secrets.

| Step | Screenshot |
| :--- | :--- |
| Setting up the web app instance | [View Photo](screenshots/app_services/as-basics.png) |
| Public access / networking settings | [View Photo](screenshots/app_services/as-networking.png) |
| Final configuration summary | [View Photo](screenshots/app_services/as-review.png) |
| Web App successfully provisioned | [View Photo](screenshots/app_services/as-success.png) |
| Enabling System-Assigned Managed Identity | [View Photo](screenshots/app_services/as-identity-on.png) |
| Configuring App Service Environment Variables | [View Photo](screenshots/app_services/as-env-variables.png) |
| GitHub deployment pipeline success | [View Photo](screenshots/app_services/as-deployment-success.png) |

---

### Phase 5: Security Layer (Azure Key Vault)

Implemented Azure Key Vault (`kv-startdown-ideas`) as the centralized secret store for the Groq API key and Cosmos DB connection string. Configured with **Role-Based Access Control (RBAC)**:

- **Key Vault Secrets User** → Assigned to the App Service's Managed Identity (runtime access).
- **Key Vault Secrets Officer** → Assigned to the developer (administrative access).

This zero-trust approach eliminates the need for hardcoded credentials anywhere in the codebase.

| Step | Screenshot |
| :--- | :--- |
| Standard Tier vault setup | [View Photo](screenshots/key_vault/kv-basics.png) |
| Configuring RBAC access model | [View Photo](screenshots/key_vault/kv-access-config.png) |
| Reviewing access policies | [View Photo](screenshots/key_vault/kv-review.png) |
| Security vault live | [View Photo](screenshots/key_vault/kv-success.png) |
| Assigning Secrets User role to Managed Identity | [View Photo](screenshots/key_vault/kv-rbac-secrets-user.png) |
| Assigning Secrets Officer role to developer | [View Photo](screenshots/key_vault/kv-rbac-self-assignment.png) |
| Production secrets stored in vault | [View Photo](screenshots/key_vault/kv-secrets-list.png) |

---

## 3. Scale-Up & Scale-Out Configuration

To fulfill the requirements for High Availability and Fault Tolerance, the following adjustments were performed:

| Configuration | Detail |
| :--- | :--- |
| **Scale-Up** | Upgraded from Free/Shared to **B1 (Basic)** to unlock Managed Identity and Scaling features. |
| **Scale-Out** | Manually adjusted instance count to **2**, ensuring traffic is load-balanced across two healthy nodes. |

---

## 4. CI/CD Pipeline (GitHub Actions)

The GitHub repository is connected to the Azure App Service via a GitHub Actions workflow (`.github/workflows/main_startdown-ideas.yml`). Every push to the `main` branch automatically:

1. Builds the React frontend (`npm run build`).
2. Authenticates with Azure using Federated Identity Credentials.
3. Deploys the full package (frontend `dist/` + backend `server/`) to the live App Service.
