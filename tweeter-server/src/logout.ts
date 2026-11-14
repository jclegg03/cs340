// AI-assisted: see AI-ATTRIBUTION.md

import { LogoutRequest, LogoutResponse } from "tweeter-shared";

// Logout endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no session storage yet, so this only accepts the token and reports success.
export const handler = async (
    request: LogoutRequest
): Promise<LogoutResponse> => {
    // TODO: invalidate request.authToken once auth tokens are stored server-side.
    return { success: true };
};
