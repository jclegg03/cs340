// AI-assisted: see AI-ATTRIBUTION.md

// Body the follow and unfollow endpoints send back: the followed/unfollowed user's
// counts after the change. Those lambdas must return this type, and the frontend
// reads the response as this type.
export interface FollowResponse {
  readonly followerCount: number;
  readonly followeeCount: number;
}
