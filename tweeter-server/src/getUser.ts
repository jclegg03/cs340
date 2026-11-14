// AI-assisted: see AI-ATTRIBUTION.md

import { FakeData, GetUserRequest, GetUserResponse } from "tweeter-shared";

// GetUser endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no user storage yet, so this looks the alias up in the fake data.
export const handler = async (
    request: GetUserRequest
): Promise<GetUserResponse> => {
    // TODO: check request.authToken once auth tokens are stored server-side.
    const user = FakeData.instance.findUserByAlias(request.alias);

    return { user: user ? user.dto : null };
};
