// AI-assisted: see AI-ATTRIBUTION.md

import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { StatusDto } from "../../dto/StatusDto";

// Body the frontend sends to the loadMoreFeedItems and loadMoreStoryItems endpoints:
// who is asking, whose feed or story to page through, and where the last page ended.
export interface PagedStatusItemRequest {
  readonly authToken: AuthTokenDto;
  readonly userAlias: string;
  readonly pageSize: number;
  // The last status on the previous page, or null to get the first page.
  readonly lastItem: StatusDto | null;
}
