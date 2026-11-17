// AI-assisted: see AI-ATTRIBUTION.md

import { AuthToken, GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";

// GetUser endpoint. user is null when no user has the alias.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = async (
    request: GetUserRequest
): Promise<GetUserResponse> => {
    const user = await new UserService().getUser(
        AuthToken.fromDto(request.authToken)!,
        request.alias
    );

    return { user: user ? user.dto : null };
};
