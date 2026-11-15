// AI-assisted: see AI-ATTRIBUTION.md

import {
    FakeData,
    GetFolloweeCountRequest,
    GetFolloweeCountResponse,
} from "tweeter-shared";

// GetFolloweeCount endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no follow storage yet, so the count comes from the fake data.
export const handler = async (
    request: GetFolloweeCountRequest
): Promise<GetFolloweeCountResponse> => {
    // TODO: check request.authToken once auth tokens are stored server-side.
    const count = await FakeData.instance.getFolloweeCount(request.user.alias);

    return { count };
};
