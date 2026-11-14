// AI-assisted: see AI-ATTRIBUTION.md

import { AuthToken, User, FakeData } from "tweeter-shared";

// Basic test endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
interface TestLoginRequest {
    alias?: string;
    password?: string;
}

interface LoginResponse {
    user: User | null;
    authToken: AuthToken;
}

export const handler = async (
    request: TestLoginRequest
): Promise<LoginResponse> => {
    const user = FakeData.instance.firstUser;
    const authToken = FakeData.instance.authToken;

    return {
        user,
        authToken,
    };
};
