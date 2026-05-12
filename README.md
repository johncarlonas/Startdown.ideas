# Startdown.ideas - Cloud Computing Final Project

**Course:** CSEC 3 – Cloud Computing (Microsoft Azure)  
**Term:** AY 2025–2026, 2nd Semester  
**Scenario:** Custom Scenario (Scenario E) - AI-Powered Startup Roasting Platform

## Project Overview
Startdown.ideas is a satirical, brutalist web application where users submit their "million-dollar" startup ideas to be ruthlessly evaluated by an AI. The project demonstrates a production-ready cloud architecture on Microsoft Azure, featuring serverless data management and zero-trust security.

### Key Features:
* **The Roast Engine:** Integration with Azure OpenAI (GPT-4o) to provide cynical, market-aware feedback.
* **Wall of Shame:** A public feed of the most delusional ideas, powered by Cosmos DB.
* **Privacy Control:** A "Share My Shame" mechanic allowing users to choose if their roast is saved to the public database.
* **Brutalist UI:** A heavy, high-contrast design system (`void`, `hazard`, and `ember` palette) inspired by early internet utilitarianism.

### Links
- **Live Demo:** `[Insert Azure App Service URL here]`
- **Video Presentation:** `[Insert Unlisted YouTube Link here]`

## Team Member
- **John Carlo Nas** - Cloud Architect & Full-stack Developer

## Cloud Architecture & Optimizations
This project utilizes a minimum of three distinct Azure services to ensure reliability, security, and cost-efficiency:

1.  **Azure App Service:** Hosts the React.js frontend. It is configured with **Autoscale Rules** to handle traffic spikes.
2.  **Azure Cosmos DB (NoSQL):** A **Serverless** database instance used to store roast JSON objects. Chosen for its ability to handle unstructured data and "scale-to-zero" cost optimization.
3.  **Azure Key Vault:** Centralized secret management. The application uses **Managed Identities** to retrieve API keys, ensuring no sensitive credentials (like OpenAI keys) are stored in the source code.

### Implemented Cloud Optimizations:
* **Cost Optimization:** Implementation of **Serverless Cosmos DB** and **F1 Free Tier App Service**, significantly reducing the monthly burn rate for a startup-style application.
* **Fault Tolerance:** Planned deployment across multiple **Availability Zones** to ensure the "Wall of Shame" remains accessible during regional outages.
* **Security:** Zero-trust architecture using **Azure Managed Identities**, removing the need for local `.env` secrets in production.

## Repository Structure
- `/diagram/` - Visual Azure Architecture Diagram (Baseline vs. Optimized).
- `/deployment/` - Step-by-step GUI screenshots and documentation for the Azure Portal.
- `/report/` - Azure Pricing Calculator report and cost-saving analysis.
- `CHANGELOG.md` - Chronological log of individual contributions and infrastructure changes.


## Infrastructure Challenges & Resolutions
### 1. Initial Constraint
- Attempted deployment of a standard App Service Plan was blocked by a RequestDisallowedByAzure policy violation.

### Technical Pivot on Number 1
- Successfully bypassed regional locks by migrating the architecture to Azure Static Web Apps.
