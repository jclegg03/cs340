// AI-assisted: see AI-ATTRIBUTION.md

// Body the getFolloweeCount endpoint sends back. The getFolloweeCount lambda must
// return this type, and the frontend reads the response as this type.
export interface GetFolloweeCountResponse {
  readonly count: number;
}
