## 2026-11-12: tweeter-server/main.tf, tweeter-server/parameters.tf, tweeter-server/api.tfvars, tweeter-server/src/login.ts, tweeter-server/.gitignore (new file), AI-ATTRIBUTION.md (new file)
- Tool: Claude Code
- Task: Do the initial Terraform setup in tweeter-server for deploying a basic test login endpoint (Lambda + API Gateway) to AWS.
- Review: The deployment works and the API is callable

## 2026-11-12: tweeter-server/main.tf, tweeter-server/parameters.tf, tweeter-server/api.tfvars, tweeter-server/.gitignore, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Add the AI-assisted header comment to the non-TypeScript files from the Terraform setup, per the updated AGENTS.md rule.
- Review: Fixed the AI-attribution issue

## 2026-11-13: tweeter-server/main.tf, tweeter-server/parameters.tf, tweeter-server/api.auto.tfvars, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Add CORS support with a configurable list of allowed origins so the web frontend can call the API.
- Review: CORS is working now.
