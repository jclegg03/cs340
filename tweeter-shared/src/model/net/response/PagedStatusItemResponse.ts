// AI-assisted: see AI-ATTRIBUTION.md

import { StatusDto } from "../../dto/StatusDto";

// Body the loadMoreFeedItems and loadMoreStoryItems endpoints send back: one page
// of statuses, and whether there are more after it. Those lambdas must return this
// type, and the frontend reads the response as this type.
export interface PagedStatusItemResponse {
  readonly items: StatusDto[];
  readonly hasMore: boolean;
}
