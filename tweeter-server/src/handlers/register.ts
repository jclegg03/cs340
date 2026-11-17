// AI-assisted: see AI-ATTRIBUTION.md

import { RegisterRequest, RegisterResponse } from "tweeter-shared";
import { UserService } from "../service/UserService";

// Register endpoint.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = async (
    request: RegisterRequest
): Promise<RegisterResponse> => {
    const [user, authToken] = await new UserService().register(
        request.firstName,
        request.lastName,
        request.alias,
        request.password,
        request.userImageBase64,
        request.imageFileExtension
    );

    return { user: user ? user.dto : null, authToken: authToken.dto };
};
