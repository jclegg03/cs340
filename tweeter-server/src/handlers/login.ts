// AI-assisted: see AI-ATTRIBUTION.md

import { LoginRequest, LoginResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";
import { withErrorTags } from "../util/withErrorTags";

// Login endpoint.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = withErrorTags(async (
    request: LoginRequest
): Promise<LoginResponse> => {
    const [user, authToken] = await new UserService().login(
        request.alias,
        request.password
    );

    return {
        success: true,
        message: null,
        user: user ? user.dto : null,
        authToken: authToken.dto,
    };
});
