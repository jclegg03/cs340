// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

// Body the frontend sends to the getFolloweeCount and getFollowerCount endpoints:
// who is asking, and whose count to look up.
export interface GetFollowCountRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly user: UserDto;
}
