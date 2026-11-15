// AI-assisted: see AI-ATTRIBUTION.md

// Body the isFollower endpoint sends back. The isFollower lambda must return this
// type, and the frontend reads the response as this type.
export interface IsFollowerResponse {
  readonly isFollower: boolean;
}
