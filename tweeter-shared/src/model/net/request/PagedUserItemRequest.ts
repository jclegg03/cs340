// AI-assisted: see AI-ATTRIBUTION.md

import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

// Body the frontend sends to the loadMoreFollowees and loadMoreFollowers endpoints:
// who is asking, whose list to page through, and where the last page ended.
export interface PagedUserItemRequest {
  readonly authToken: AuthTokenDto;
  readonly userAlias: string;
  readonly pageSize: number;
  // The last user on the previous page, or null to get the first page.
  readonly lastItem: UserDto | null;
}
