// AI-assisted: see AI-ATTRIBUTION.md

import {
    AuthToken,
    IsFollowerRequest,
    IsFollowerResponse,
    User,
} from "tweeter-shared";
import { FollowService } from "../service/FollowService";

// IsFollower endpoint: whether request.user follows request.selectedUser.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = async (
    request: IsFollowerRequest
): Promise<IsFollowerResponse> => {
    const isFollower = await new FollowService().getIsFollowerStatus(
        AuthToken.fromDto(request.authToken)!,
        User.fromDto(request.user)!,
        User.fromDto(request.selectedUser)!
    );

    return { success: true, message: null, isFollower };
};
