// AI-assisted: see AI-ATTRIBUTION.md

// Base type for every response body the server sends back. success is false when
// the request failed, and message then says why. message is null on success.
export interface TweeterResponse {
  readonly success: boolean;
  readonly message: string | null;
}
