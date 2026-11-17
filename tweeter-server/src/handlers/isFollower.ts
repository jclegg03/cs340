// AI-assisted: see AI-ATTRIBUTION.md

import { FakeData, IsFollowerRequest, IsFollowerResponse } from "tweeter-shared";

// IsFollower endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no follow storage yet, so the answer comes from the fake data.
export const handler = async (
    request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
    // TODO: check request.authToken and look up whether request.user follows
    // request.selectedUser once storage exists.
    return { isFollower: FakeData.instance.isFollower() };
};
