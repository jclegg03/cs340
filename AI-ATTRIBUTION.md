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

## 2026-11-15: tweeter-shared/src/model/net/request/IsFollowerRequest.ts (new file), tweeter-shared/src/model/net/response/IsFollowerResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/isFollower.ts (new file), tweeter-server/api.auto.tfvars, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the isFollower endpoint in the backend and wire it up to the frontend.
- Review: Thought it didn't work at first then realized I forgot to rerun the backend build command. Works e2e.

## 2026-11-15: tweeter-shared/src/model/net/request/PagedUserItemRequest.ts (new file), tweeter-shared/src/model/net/response/PagedUserItemResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/loadMoreFollowees.ts (new file), tweeter-server/src/loadMoreFollowers.ts (new file), tweeter-server/api.auto.tfvars, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the loadMoreFollowees and loadMoreFollowers endpoints in the backend and wire them up to the frontend.
- Review: Works e2e. Claude did a good job deduping the request/res types and also the API calls since they're identical besides the name.

## 2026-11-16: tweeter-shared/src/model/dto/StatusDto.ts (new file), tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts (new file), tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts (new file), tweeter-shared/src/model/domain/Status.ts, tweeter-shared/src/index.ts, tweeter-server/src/loadMoreFeedItems.ts (new file), tweeter-server/src/loadMoreStoryItems.ts (new file), tweeter-server/api.auto.tfvars, tweeter-web/src/model.service/StatusService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the loadMoreFeedItems and loadMoreStoryItems endpoints in the backend and wire them up to the frontend.
- Review: Some duplicated code, mostly the return types. Will refactor to dedup. E2E test passes.

## 2026-11-16: tweeter-shared/src/model/net/request/PagedItemRequest.ts (new file), tweeter-shared/src/model/net/response/PagedItemResponse.ts (new file), tweeter-shared/src/model/net/request/PagedUserItemRequest.ts (deleted), tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts (deleted), tweeter-shared/src/model/net/response/PagedUserItemResponse.ts (deleted), tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts (deleted), tweeter-shared/src/index.ts, tweeter-server/src/loadMoreFollowees.ts, tweeter-server/src/loadMoreFollowers.ts, tweeter-server/src/loadMoreFeedItems.ts, tweeter-server/src/loadMoreStoryItems.ts, tweeter-web/src/model.service/FollowService.ts, tweeter-web/src/model.service/StatusService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Deduplicate the PagedUserItem and PagedStatusItem request and response types.
- Review: Code looks clean and the e2e tests still pass.

## 2026-11-16: tweeter-shared/src/model/net/request/PostStatusRequest.ts (new file), tweeter-shared/src/model/net/response/PostStatusResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/postStatus.ts (new file), tweeter-server/api.auto.tfvars, tweeter-web/src/model.service/StatusService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Create the postStatus endpoint in the backend and wire it up to the frontend.
- Review: e2e test passes. Code looks good.

## 2026-11-17: tweeter-server/src/follow.ts -> tweeter-server/src/handlers/follow.ts (moved), tweeter-server/src/getFolloweeCount.ts -> tweeter-server/src/handlers/getFolloweeCount.ts (moved), tweeter-server/src/getFollowerCount.ts -> tweeter-server/src/handlers/getFollowerCount.ts (moved), tweeter-server/src/getUser.ts -> tweeter-server/src/handlers/getUser.ts (moved), tweeter-server/src/isFollower.ts -> tweeter-server/src/handlers/isFollower.ts (moved), tweeter-server/src/loadMoreFeedItems.ts -> tweeter-server/src/handlers/loadMoreFeedItems.ts (moved), tweeter-server/src/loadMoreFollowees.ts -> tweeter-server/src/handlers/loadMoreFollowees.ts (moved), tweeter-server/src/loadMoreFollowers.ts -> tweeter-server/src/handlers/loadMoreFollowers.ts (moved), tweeter-server/src/loadMoreStoryItems.ts -> tweeter-server/src/handlers/loadMoreStoryItems.ts (moved), tweeter-server/src/login.ts -> tweeter-server/src/handlers/login.ts (moved), tweeter-server/src/logout.ts -> tweeter-server/src/handlers/logout.ts (moved), tweeter-server/src/postStatus.ts -> tweeter-server/src/handlers/postStatus.ts (moved), tweeter-server/src/register.ts -> tweeter-server/src/handlers/register.ts (moved), tweeter-server/src/unfollow.ts -> tweeter-server/src/handlers/unfollow.ts (moved), tweeter-server/api.auto.tfvars, tweeter-server/parameters.tf, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Refactor the backend lambda handlers into the src/handlers folder.
- Review: Move handlers to the handlers folder. e2e still works

## 2026-11-17: tweeter-server/src/handlers/follow.ts, tweeter-server/src/handlers/getFolloweeCount.ts, tweeter-server/src/handlers/getFollowerCount.ts, tweeter-server/src/handlers/getUser.ts, tweeter-server/src/handlers/isFollower.ts, tweeter-server/src/handlers/loadMoreFeedItems.ts, tweeter-server/src/handlers/loadMoreFollowees.ts, tweeter-server/src/handlers/loadMoreFollowers.ts, tweeter-server/src/handlers/loadMoreStoryItems.ts, tweeter-server/src/handlers/login.ts, tweeter-server/src/handlers/logout.ts, tweeter-server/src/handlers/postStatus.ts, tweeter-server/src/handlers/register.ts, tweeter-server/src/handlers/unfollow.ts, tweeter-server/src/service/FollowService.ts, tweeter-server/src/service/Service.ts, tweeter-server/src/service/StatusService.ts, tweeter-server/src/service/UserService.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Refactor the backend handlers to call the services for the fake data, so the handlers only convert requests and responses to and from DTOs.
- Review: e2e tests pass. The service interface just added comments so I removed those. Everything else looks good

## 2026-11-17: tweeter-server/src/handlers/follow.ts, tweeter-server/src/handlers/getFolloweeCount.ts, tweeter-server/src/handlers/getFollowerCount.ts, tweeter-server/src/handlers/getUser.ts, tweeter-server/src/handlers/isFollower.ts, tweeter-server/src/handlers/loadMoreFeedItems.ts, tweeter-server/src/handlers/loadMoreFollowees.ts, tweeter-server/src/handlers/loadMoreFollowers.ts, tweeter-server/src/handlers/loadMoreStoryItems.ts, tweeter-server/src/handlers/login.ts, tweeter-server/src/handlers/logout.ts, tweeter-server/src/handlers/postStatus.ts, tweeter-server/src/handlers/register.ts, tweeter-server/src/handlers/unfollow.ts, tweeter-shared/src/index.ts, tweeter-shared/src/model/net/request/FollowRequest.ts, tweeter-shared/src/model/net/request/GetFollowCountRequest.ts, tweeter-shared/src/model/net/request/GetUserRequest.ts, tweeter-shared/src/model/net/request/IsFollowerRequest.ts, tweeter-shared/src/model/net/request/LoginRequest.ts, tweeter-shared/src/model/net/request/LogoutRequest.ts, tweeter-shared/src/model/net/request/PagedItemRequest.ts, tweeter-shared/src/model/net/request/PostStatusRequest.ts, tweeter-shared/src/model/net/request/RegisterRequest.ts, tweeter-shared/src/model/net/response/FollowResponse.ts, tweeter-shared/src/model/net/response/GetFollowCountResponse.ts, tweeter-shared/src/model/net/response/GetUserResponse.ts, tweeter-shared/src/model/net/response/IsFollowerResponse.ts, tweeter-shared/src/model/net/response/LoginResponse.ts, tweeter-shared/src/model/net/response/LogoutResponse.ts, tweeter-shared/src/model/net/response/PagedItemResponse.ts, tweeter-shared/src/model/net/response/PostStatusResponse.ts, tweeter-shared/src/model/net/response/RegisterResponse.ts, tweeter-web/src/model.service/FollowService.ts, tweeter-web/src/model.service/Service.ts, tweeter-web/src/model.service/StatusService.ts, tweeter-web/src/model.service/UserService.ts, tweeter-shared/src/model/net/request/TweeterRequest.ts (new file), tweeter-shared/src/model/net/response/TweeterResponse.ts (new file), tweeter-web/src/network/ClientCommunicator.ts (new file), tweeter-web/src/network/ServerFacade.ts (new file), AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Refactor the frontend services to call a ServerFacade, which converts to and from DTOs and sends requests through a ClientCommunicator (code for both provided by me).
- Review: Splitting review into 2 parts. BE and FE. e2e works. Now reviewing backend changes. BE added request/res base objects and refactored handlers to use them. The base res objects have a success and message attribute. The frontend now has the following flow: service converts objects to dto and calls the server facade. The server facade calls the client communicator which sends the HTTP request and returns the response. The facade then converts the dto into real objects for the service to use.

## 2026-11-17: tweeter-web/test/network/ServerFacade.test.ts (new file), AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Write Jest integration tests that call the ServerFacade directly to verify it communicates with the server, starting with register only.
- Review: Test passes and tests against the fake data class.

## 2026-11-17: tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Add Jest integration tests that call the ServerFacade directly to verify getting followers (getMoreFollowers) from the server.
- Review: tests look good. Tests the first page against fake data. Tests that the next page starts in the right spot. Tests that the last page is marked correctly. All tests pass.

## 2026-11-17: tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Add a Jest integration test that calls the ServerFacade directly to verify getting the following (followee) count from the server.
- Review: test checks the right things and passes.

## 2026-11-17: tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Add a Jest integration test that calls the ServerFacade directly to verify getting the follower count from the server.
- Review: Looks good aside from duplication. Will fix in next prompt.

## 2026-11-17: tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Deduplicate the getFolloweeCount and getFollowerCount integration tests using describe.each.
- Review: dedup works and tests pass

## 2026-11-17: tweeter-web/test/model.service/StatusService.test.ts (new file), AI-ATTRIBUTION.md
- Tool: Claude Code
- Task: Write a Jest integration test for the client-side StatusService that verifies a successful retrieval of a user's story pages.
- Review: Tests that the first and second page look right. tests pass.
