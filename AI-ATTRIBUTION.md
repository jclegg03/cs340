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

## 2026-11-14: tweeter-server/src/logout.ts (new file), tweeter-server/api.auto.tfvars, tweeter-shared/src/model/net/request/LogoutRequest.ts (new file), tweeter-shared/src/model/net/response/LogoutResponse.ts (new file), tweeter-shared/src/index.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the logout API on the backend, without wiring it up to the frontend yet.
- Review: added logout response and request types. Also add code to create the lambda

## 2026-11-14: tweeter-web/src/model.service/UserService.ts, tweeter-web/src/presenter/appNavbar/AppNavbarPresenter.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Wire the frontend logout up to the new backend logout API.
- Review: Looks good. Full stack test worked.

## 2026-11-14: tweeter-shared/src/model/net/request/LoginRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/login.ts, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Update the frontend API calls to use the generic callApi function, adding a LoginRequest type to the shared module.
- Review: the deduplication looks clean

## 2026-11-14: tweeter-shared/src/model/net/request/RegisterRequest.ts (new file), tweeter-shared/src/model/net/response/RegisterResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/register.ts (new file), tweeter-server/api.auto.tfvars, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the register endpoint on the backend and wire it up to the frontend.
- Review: Looks good, it appears it didn't fix the imports that are no longer used by the frontend. Actually, it is correct. We still need to make the getUser endpoint. E2E test worked.

## 2026-11-14: tweeter-shared/src/model/net/request/GetUserRequest.ts (new file), tweeter-shared/src/model/net/response/GetUserResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/getUser.ts (new file), tweeter-server/api.auto.tfvars, tweeter-web/src/model.service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the getUser endpoint on the backend and wire it up to the frontend.
- Review: created the endpoint as getuser. I updated it to getUser. E2E passes too.

## 2026-11-15: tweeter-shared/src/model/net/request/GetFolloweeCountRequest.ts (new file), tweeter-shared/src/model/net/response/GetFolloweeCountResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/getFolloweeCount.ts (new file), tweeter-server/api.auto.tfvars, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the getFolloweeCount endpoint in the backend.
- Review: Looks good, created the Req and res types, and does the same thing the frontend previously did.

## 2026-11-15: tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Wire the frontend's FollowService.getFolloweeCount up to the new getFolloweeCount backend endpoint.
- Review: Frontend wired up. E2E test passed.

## 2026-11-15: tweeter-shared/src/model/net/request/GetFollowerCountRequest.ts (new file), tweeter-shared/src/model/net/response/GetFollowerCountResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/getFollowerCount.ts (new file), tweeter-server/api.auto.tfvars, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the getFollowerCount endpoint in the backend and wire it up to the frontend.
- Review: Looks good, E2E test passes.

## 2026-11-15: tweeter-shared/src/model/net/request/GetFollowCountRequest.ts (new file), tweeter-shared/src/model/net/response/GetFollowCountResponse.ts (new file), tweeter-shared/src/model/net/request/GetFolloweeCountRequest.ts (deleted), tweeter-shared/src/model/net/request/GetFollowerCountRequest.ts (deleted), tweeter-shared/src/model/net/response/GetFolloweeCountResponse.ts (deleted), tweeter-shared/src/model/net/response/GetFollowerCountResponse.ts (deleted), tweeter-shared/src/index.ts, tweeter-server/src/getFolloweeCount.ts, tweeter-server/src/getFollowerCount.ts, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Deduplicate the identical GetFolloweeCount/GetFollowerCount request and response types into a single GetFollowCountRequest/GetFollowCountResponse.
- Review: Now unified to 2 types.

## 2026-11-15: tweeter-shared/src/model/net/request/FollowRequest.ts (new file), tweeter-shared/src/model/net/response/FollowResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/follow.ts (new file), tweeter-server/src/unfollow.ts (new file), tweeter-server/api.auto.tfvars, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the follow and unfollow endpoints in the backend and wire them up to the frontend.
- Review: e2e test worked. Worth noting that it may need updating once we move off fake data.

## 2026-11-15: tweeter-server/main.tf, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Speed up deploys by uploading lambda.zip once to S3 with Terraform and pointing every lambda at that S3 object instead of each uploading its own copy.
- Review: Change looks good and verified objects were created. It works e2e and deployment time was cut significantly.
