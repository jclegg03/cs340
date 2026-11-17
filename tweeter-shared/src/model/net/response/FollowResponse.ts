// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterResponse } from "./TweeterResponse";

// Body the follow and unfollow endpoints send back: the followed/unfollowed user's
// counts after the change. Those lambdas must return this type, and the frontend
// reads the response as this type.
export interface FollowResponse extends TweeterResponse {
  readonly followerCount: number;
  readonly followeeCount: number;
}
