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

## 2026-11-14: tweeter-server/main.tf, tweeter-server/package.json, tweeter-server/.gitignore, tweeter-server/scripts/build-layer.mjs (new file), AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Update the lambdas so they have access to and depend on the shared module, by creating a Lambda layer.
- Review: Added the script to build the layer and the tf to deploy it.

## 2026-11-14: tweeter-shared/src/model/dto/UserDto.ts (new file), tweeter-shared/src/model/dto/AuthTokenDto.ts (new file), tweeter-shared/src/model/domain/User.ts, tweeter-shared/src/model/domain/AuthToken.ts, tweeter-shared/src/index.ts, tweeter-server/src/login.ts, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Set up DTOs for User and AuthToken so the login lambda returns plain field names (alias, firstName, ...) instead of the classes' private _-prefixed fields.
- Review: It did well with setting up the DTOs. I will add another prompt to have it add the response object type to make it easier to typecheck the frontend and backend in another prompt.

## 2026-11-14: tweeter-shared/src/model/net/response/LoginResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/login.ts, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create a LoginResponse type in the shared module so the login lambda must return that shape and the frontend reads the response as it.
- Review: Everything continues to work and the code now has less duplication due to that interface.
