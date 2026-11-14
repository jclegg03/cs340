// AI-assisted: see AI-ATTRIBUTION.md

import { FakeData, RegisterRequest, RegisterResponse } from "tweeter-shared";

// Register endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no user storage yet, so this returns the fake first user.
export const handler = async (
    request: RegisterRequest
): Promise<RegisterResponse> => {
    // TODO: save the new user and upload request.userImageBase64 once storage exists.
    const user = FakeData.instance.firstUser;
    const authToken = FakeData.instance.authToken;

    return {
        user: user ? user.dto : null,
        authToken: authToken.dto,
    };
};
