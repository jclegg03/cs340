// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

// Body the frontend sends to the paged endpoints (loadMoreFollowees, loadMoreFollowers,
// loadMoreFeedItems, loadMoreStoryItems): who is asking, whose list to page through,
// and where the last page ended. T is the item's DTO type, e.g. UserDto or StatusDto.
export interface PagedItemRequest<T> extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly userAlias: string;
  readonly pageSize: number;
  // The last item on the previous page, or null to get the first page.
  readonly lastItem: T | null;
}
