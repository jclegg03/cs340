// AI-assisted: see AI-ATTRIBUTION.md

import { PostStatusRequest, PostStatusResponse } from "tweeter-shared";

// PostStatus endpoint: API Gateway passes the JSON request body in as `request`
// and returns whatever this function returns as the response body.
// There is no status storage yet, so the status is not saved anywhere.
export const handler = async (
    request: PostStatusRequest
): Promise<PostStatusResponse> => {
    // TODO: check request.authToken and save request.newStatus to the poster's
    // story and their followers' feeds once storage exists.
    return { success: true };
};
