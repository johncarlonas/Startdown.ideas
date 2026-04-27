# Startdown.ideas - Cloud Computing Final Project

**Course:** CSEC 3 – Cloud Computing (Microsoft Azure)  
**Term:** AY 2025–2026, 2nd Semester  
**Scenario:** Custom Scenario (Scenario E) - AI-Powered Startup Roasting Platform

## Project Overview

Startdown.ideas is a satirical, brutalist web application where users submit their startup ideas to be ruthlessly evaluated by an AI. The application is built using React.js and deployed entirely on Microsoft Azure, demonstrating a secure, scalable, and highly available cloud architecture.

### Links

- **Live Demo:** `[Insert Azure App Service URL here once deployed]`
- **Video Presentation:** `[Insert Unlisted YouTube Link here]`

## Team Member

- **John Carlo Nas** - Full-stack Developer, Cloud Architect

## Cloud Architecture & Optimizations

This project utilizes a minimum of three distinct Azure services to ensure reliability and performance:

1. **Azure App Service:** Hosts the React frontend and handles user requests.
2. **Azure Cosmos DB (NoSQL):** Stores the "Wall of Shame" data (user inputs, AI roasts, and scores) in a serverless, fast-read format.
3. **Azure Key Vault:** Securely stores sensitive credentials like the OpenAI API key, completely removing secrets from the source code.

**Implemented Cloud Optimizations:**

- **Scalability:** Azure App Service Plan configured with Autoscale Rules (automatically scales out when CPU exceeds 70%).
- **Security & DevOps:** Integration of Azure Key Vault with Managed Identities to ensure zero-trust secret management between the App Service and external APIs.

## Repository Structure

- `/diagram/` - Contains the visual Azure architecture diagram.
- `/deployment/` - Contains IaC scripts (Azure CLI/Bicep) and deployment documentation.
- `/report/` - Contains the Azure Pricing Calculator cost estimate.
- `CHANGELOG.md` - Chronological log of team contributions.
