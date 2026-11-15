// AI-assisted: see AI-ATTRIBUTION.md

import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

// Body the frontend sends to the getFolloweeCount endpoint: who is asking,
// and whose followee count to look up.
export interface GetFolloweeCountRequest {
  readonly authToken: AuthTokenDto;
  readonly user: UserDto;
}
