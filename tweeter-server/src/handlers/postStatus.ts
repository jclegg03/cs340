// AI-assisted: see AI-ATTRIBUTION.md

import {
    AuthToken,
    PostStatusRequest,
    PostStatusResponse,
    Status,
} from "tweeter-shared";
import { StatusService } from "../service/StatusService";
import { withErrorTags } from "../util/withErrorTags";

// PostStatus endpoint.
// API Gateway passes the JSON request body in as `request` and returns whatever
// this function returns as the response body. This only converts DTOs to and from
// domain objects; the service does the work.
export const handler = withErrorTags(async (
    request: PostStatusRequest
): Promise<PostStatusResponse> => {
    await new StatusService().postStatus(
        AuthToken.fromDto(request.authToken)!,
        Status.fromDto(request.newStatus)!
    );

    return { success: true, message: null };
});
