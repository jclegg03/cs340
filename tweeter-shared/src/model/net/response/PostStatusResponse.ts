// AI-assisted: see AI-ATTRIBUTION.md

// Body the postStatus endpoint sends back. The postStatus lambda must return this
// type, and the frontend reads the response as this type.
export interface PostStatusResponse {
  readonly success: boolean;
}
