// AI-assisted: see AI-ATTRIBUTION.md

// Body the getFolloweeCount and getFollowerCount endpoints send back. Those lambdas
// must return this type, and the frontend reads the response as this type.
export interface GetFollowCountResponse {
  readonly count: number;
}
