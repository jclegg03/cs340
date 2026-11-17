// AI-assisted: see AI-ATTRIBUTION.md

import {
    AuthToken,
    PagedItemRequest,
    PagedItemResponse,
    User,
    UserDto,
} from "tweeter-shared";
import { FollowService } from "../service/FollowService";

// LoadMoreFollowers endpoint.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = async (
    request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
    const [users, hasMore] = await new FollowService().loadMoreFollowers(
        AuthToken.fromDto(request.authToken)!,
        request.userAlias,
        request.pageSize,
        User.fromDto(request.lastItem)
    );

    return {
        success: true,
        message: null,
        items: users.map((user) => user.dto),
        hasMore,
    };
};
