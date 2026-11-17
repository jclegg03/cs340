// AI-assisted: see AI-ATTRIBUTION.md

import { AuthToken, LogoutRequest, LogoutResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";
import { withErrorTags } from "../util/withErrorTags";

// Logout endpoint.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = withErrorTags(async (
    request: LogoutRequest
): Promise<LogoutResponse> => {
    await new UserService().logout(AuthToken.fromDto(request.authToken)!);

    return { success: true, message: null };
});
