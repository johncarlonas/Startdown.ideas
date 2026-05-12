# Final Project Report: Startdown.ideas

## 1. Executive Summary
**Startdown.ideas** is a cloud-native, AI-powered platform designed to provide ruthless, market-aware critiques of startup concepts. Built for the CSEC 3 Cloud Computing course, this project demonstrates a production-ready Azure architecture that balances high performance, zero-trust security, and extreme cost optimization.

## 2. Project Scenario
The platform serves as a "brutalist" mirror to the startup world. Users submit their ideas, which are then processed by a "Roast Engine" (integrated with Llama 3.3 via Groq). The results are either kept private or shared on the public "Wall of Shame," creating a community-driven feed of ambitious but often delusional business models.

## 3. Cloud Architecture Overview
The architecture is designed to handle variable traffic while ensuring that no single point of failure exists.

### 3.1 Compute Layer: Azure App Service
- **Service:** Web App on Linux (Node.js 22 runtime).
- **Scale-Out:** Configured with **2 instances** in the Japan East region to ensure High Availability (HA).
- **Pricing Tier:** B1 (Basic) – chosen to support Managed Identities and manual scaling while remaining cost-effective.

### 3.2 Data Layer: Azure Cosmos DB
- **Model:** NoSQL (JSON Document Store).
- **Capacity Mode:** **Serverless**.
- **Rationale:** Startups often have unpredictable traffic. Serverless mode ensures we only pay for the Request Units (RUs) consumed during a "roast" or a "wall fetch," eliminating idle costs entirely.

### 3.3 Security Layer: Azure Key Vault
- **Function:** Centralized secret management for API keys (Groq, Cosmos DB).
- **Access Control:** **RBAC (Role-Based Access Control)**.
- **Identity:** Utilizes **System-Assigned Managed Identity** for the App Service, removing the need for local `.env` files in production.

## 4. Security & Fault Tolerance
### 4.1 Zero-Trust Implementation
We implemented a zero-trust model where the application code never "knows" its own secrets.
1. The App Service is granted the **Key Vault Secrets User** role.
2. The developer (John Carlo Nas) maintains the **Key Vault Secrets Officer** role for administrative tasks.
3. Secrets are fetched at runtime via the `@azure/identity` SDK.

### 4.2 High Availability
The platform is resilient to individual instance failures. By maintaining a minimum of 2 instances, Azure’s load balancer automatically routes traffic away from unhealthy nodes, satisfying the project’s fault-tolerance requirements.

## 5. Monitoring & Observability
### 5.1 Application Insights Integration
To ensure the platform remains stable and performant, we integrated **Azure Application Insights**. This provides:
1. **Request Tracking**: Real-time monitoring of every incoming request to the App Service.
2. **Dependency Analysis**: Tracking response times from the Groq AI engine and Cosmos DB.
3. **Exception Logging**: Automatic capture of backend errors for rapid debugging.
4. **Performance Metrics**: Monitoring CPU and Memory usage across both instances.

## 6. Deployment & CI/CD
The project utilizes a modern DevOps workflow:
- **Source Control:** GitHub.
- **Continuous Deployment:** GitHub Actions automatically builds the React frontend and deploys the entire package to the Azure Web App upon every push to `main`.
- **Infrastructure Management:** Provisioned via the Azure Portal GUI with detailed step-by-step documentation.

## 7. Conclusion
Startdown.ideas successfully integrates advanced AI with enterprise-grade cloud services. By leveraging Azure’s serverless and managed offerings, we have created a platform that is both technologically robust and financially sustainable, meeting all criteria for the CSEC 3 final project.
