// AI-assisted: see AI-ATTRIBUTION.md

import {
    FakeData,
    PagedUserItemRequest,
    PagedUserItemResponse,
    User,
} from "tweeter-shared";

// LoadMoreFollowees endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no follow storage yet, so the page of followees comes from the fake data.
export const handler = async (
    request: PagedUserItemRequest
): Promise<PagedUserItemResponse> => {
    // TODO: check request.authToken once auth tokens are stored server-side.
    const [users, hasMore] = FakeData.instance.getPageOfUsers(
        User.fromDto(request.lastItem),
        request.pageSize,
        request.userAlias
    );

    return { items: users.map((user) => user.dto), hasMore };
};
