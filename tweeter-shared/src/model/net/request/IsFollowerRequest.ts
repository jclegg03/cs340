// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

// Body the frontend sends to the isFollower endpoint: who is asking, and the
// pair of users to check (is `user` a follower of `selectedUser`?).
export interface IsFollowerRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly user: UserDto;
  readonly selectedUser: UserDto;
}
