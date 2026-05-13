# Startdown.ideas - Cloud Computing Final Project

**Course:** CSEC 3 – Cloud Computing (Microsoft Azure)  
**Term:** AY 2025–2026, 2nd Semester  
**Scenario:** Custom Scenario (Scenario E) - AI-Powered Startup Roasting Platform

## Project Overview
Startdown.ideas is a satirical, brutalist web application where users submit their startup ideas to be ruthlessly evaluated by an AI. The project demonstrates a production-ready cloud architecture on Microsoft Azure, featuring serverless data management and zero-trust security.

---

## Final Project Deliverables

### Deliverable 1: Architecture Diagram
![Startdown Azure Architecture](./diagram/architecture.png)

> [Check the detailed architectural breakdown here](./diagram/architecture.md)

### Deliverable 2: Deployment Documentation
Comprehensive setup guides and GUI-based provisioning walkthroughs are located in the [deployment](./deployment/) directory. 

#### Quick Start Deployment Guide
**Prerequisites**
* Azure Subscription (Azure for Students).
* GitHub Repository access for CI/CD setup.
* Proper RBAC permissions for Key Vault management.

**Deployment Highlights**
1. **Infrastructure Provisioning**: Manual setup via Azure Portal (Japan East) following the [Detailed Deployment Guide](./deployment/README.md).
2. **CI/CD Integration**: Connect GitHub via the **Deployment Center** to trigger automated builds using Federated Credentials.
3. **Secret Management**: Provision **Managed Identity** and link to **Key Vault** for passwordless connection to Cosmos DB and Groq API.

### Deliverable 3: Cost Estimate Report
The following itemized monthly cost estimate is based on the **Japan East** region, optimized for the Azure for Students credit limit.

| Azure Service | Configuration Details | Estimated Monthly Cost |
| :--- | :--- | :--- |
| **App Service Plan** | Basic (B1) Tier, 2 Instances (Manual Scale-out) | $27.74 |
| **Cosmos DB** | Serverless Mode (NoSQL), 1M RUs Baseline | $0.25 |
| **Key Vault** | Standard Tier (10,000 Ops/Month) | $0.03 |
| **Bandwidth** | 5 GB Egress (Free Tier) | $0.00 |
| **Total Estimated Cost** | | **$28.02 / Month** |

For the complete analysis and cost optimization strategies, view the [Full Cost Estimate Report](./report/cost-estimate.md).

### Deliverable 4: Live Demo and Video Presentation
* **Live Application URL:** [Startdown.ideas URL](https://startdown-ideas-bpg7g0fze0h7f0e3.japaneast-01.azurewebsites.net/)
* **Video Presentation:** [Cloud Computing Final Project - Startdown.ideas on Azure]([https://youtu.be/I3Aygtw2sIg])

---

## Cloud Optimizations
To satisfy the requirements for a high-performance, secure, and cost-efficient platform, the following optimizations were implemented:

1. **[O1] CI/CD Automation (DevOps)**: Implemented GitHub Actions to automate the build and deployment process, reducing human error and ensuring consistent updates to the Roast Engine.
2. **[O2] Managed Identity & Key Vault (Security)**: Implemented a Zero-Trust approach using Azure Managed Identities and Key Vault to eliminate hardcoded secrets and "Secret Leakage" risks.
3. **[O3] Advanced Telemetry & Monitoring (Operations)**: Integrated Azure Application Insights for deep-level telemetry, tracking request latency and AI engine performance in real-time.
4. **[O4] Serverless Architecture (Cost Optimization)**: Utilized Azure Cosmos DB in Serverless mode to eliminate idle costs, perfect for handling unpredictable startup traffic patterns.
---

## Technical Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Vanilla CSS |
| **Backend** | Node.js, Express |
| **AI Engine** | Groq API (Llama 3.3-70b) |
| **Database** | Azure Cosmos DB (Serverless) |
| **Security** | Managed Identity, Azure Key Vault |
| **Monitoring** | Azure Application Insights |

---

## Project Team
| Name | Role |
| :--- | :--- |
| **John Carlo Nas** | Cloud Architect & Full-stack Developer |

---

## Repository Structure
```text
Startdown/
├── .github/            # CI/CD Workflows (GitHub Actions)
├── deployment/         # Step-by-step GUI provisioning documentation
├── diagram/            # Architecture diagrams and technical docs
├── report/             # Cost analysis and pricing reports
├── startdown/          # Application source code (React + Node.js)
├── CHANGELOG.md        # Chronological log of project updates
└── README.md           # Project overview and documentation
```

---

## Infrastructure Challenges & Resolutions

### Challenge 1: RequestDisallowedByAzure Policy Block
*   **Issue**: Attempted to deploy a standard App Service Plan but hit a `RequestDisallowedByAzure` policy violation.
*   **Resolution**: Switched region to **Japan East** and validated the **B1 Basic tier**, which bypassed the tenant-level policy restrictions.

### Challenge 2: Static Web Apps Policy Block (Intermediary Attempt)
*   **Issue**: Tried migrating to Azure Static Web Apps as a workaround, but hit persistent tenant-level compliance blocks.
*   **Resolution**: Abandoned Static Web Apps entirely. Pivoted final architecture to **App Service (B1)** which worked successfully.

### Challenge 3: API Throttling (Error 429)
*   **Issue**: Rapid infrastructure provisioning triggered Azure API throttling.
*   **Resolution**: Slowed down resource creation and re-validated each service individually.
