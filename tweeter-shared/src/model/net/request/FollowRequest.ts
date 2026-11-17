// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

// Body the frontend sends to the follow and unfollow endpoints: who is asking,
// and which user they are following or unfollowing.
export interface FollowRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly user: UserDto;
}
