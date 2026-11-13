// AI-assisted: see AI-ATTRIBUTION.md

// Basic test endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
interface TestLoginRequest {
    alias?: string;
    password?: string;
}

interface TestLoginResponse {
    success: boolean;
    message: string;
    alias: string | null;
}

export const handler = async (
    request: TestLoginRequest
): Promise<TestLoginResponse> => {
    console.log("Login function called");
    return {
        success: true,
        message: "Test login endpoint reached",
        alias: request?.alias ?? null,
    };
};
