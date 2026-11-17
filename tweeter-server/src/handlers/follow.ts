// AI-assisted: see AI-ATTRIBUTION.md

import { AuthToken, FollowRequest, FollowResponse, User } from "tweeter-shared";
import { FollowService } from "../service/FollowService";
import { withErrorTags } from "../util/withErrorTags";

// Follow endpoint. Returns the user's counts after the change.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = withErrorTags(async (
    request: FollowRequest
): Promise<FollowResponse> => {
    const [followerCount, followeeCount] = await new FollowService().follow(
        AuthToken.fromDto(request.authToken)!,
        User.fromDto(request.user)!
    );

    return { success: true, message: null, followerCount, followeeCount };
});
