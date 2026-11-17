// AI-assisted: see AI-ATTRIBUTION.md

import {
    AuthToken,
    PagedItemRequest,
    PagedItemResponse,
    Status,
    StatusDto,
} from "tweeter-shared";
import { StatusService } from "../service/StatusService";

// LoadMoreStoryItems endpoint.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = async (
    request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
    const [statuses, hasMore] = await new StatusService().loadMoreStoryItems(
        AuthToken.fromDto(request.authToken)!,
        request.userAlias,
        request.pageSize,
        Status.fromDto(request.lastItem)
    );

    return {
        success: true,
        message: null,
        items: statuses.map((status) => status.dto),
        hasMore,
    };
};
