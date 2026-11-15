// AI-assisted: see AI-ATTRIBUTION.md

import { FakeData, FollowRequest, FollowResponse } from "tweeter-shared";

// Follow endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no follow storage yet, so nothing is saved and the counts come from the fake data.
export const handler = async (
    request: FollowRequest
): Promise<FollowResponse> => {
    // TODO: check request.authToken and record the follow once storage exists.
    // TODO: make sure this calls the right functions to get the updated counts.
    const followerCount = await FakeData.instance.getFollowerCount(request.user.alias);
    const followeeCount = await FakeData.instance.getFolloweeCount(request.user.alias);

    return { followerCount, followeeCount };
};
