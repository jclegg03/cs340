// AI-assisted: see AI-ATTRIBUTION.md

import {
    FakeData,
    PagedItemRequest,
    PagedItemResponse,
    Status,
    StatusDto,
} from "tweeter-shared";

// LoadMoreFeedItems endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no status storage yet, so the page of feed statuses comes from the fake data.
export const handler = async (
    request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
    // TODO: check request.authToken, and use request.userAlias to pick whose
    // feed to load once statuses are stored server-side.
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
        Status.fromDto(request.lastItem),
        request.pageSize
    );

    return { items: statuses.map((status) => status.dto), hasMore };
};
