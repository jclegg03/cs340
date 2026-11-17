// AI-assisted: see AI-ATTRIBUTION.md

import {
    AuthToken,
    GetFollowCountRequest,
    GetFollowCountResponse,
    User,
} from "tweeter-shared";
import { FollowService } from "../service/FollowService";

// GetFollowerCount endpoint.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = async (
    request: GetFollowCountRequest
): Promise<GetFollowCountResponse> => {
    const count = await new FollowService().getFollowerCount(
        AuthToken.fromDto(request.authToken)!,
        User.fromDto(request.user)!
    );

    return { success: true, message: null, count };
};
