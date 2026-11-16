// AI-assisted: see AI-ATTRIBUTION.md

import {
    FakeData,
    PagedStatusItemRequest,
    PagedStatusItemResponse,
    Status,
} from "tweeter-shared";

// LoadMoreStoryItems endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no status storage yet, so the page of story statuses comes from the fake data.
export const handler = async (
    request: PagedStatusItemRequest
): Promise<PagedStatusItemResponse> => {
    // TODO: check request.authToken, and use request.userAlias to pick whose
    // story to load once statuses are stored server-side.
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
        Status.fromDto(request.lastItem),
        request.pageSize
    );

    return { items: statuses.map((status) => status.dto), hasMore };
};
