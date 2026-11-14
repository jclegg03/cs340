// AI-assisted: see AI-ATTRIBUTION.md

// Body the frontend sends to the login endpoint.
export interface LoginRequest {
  readonly alias: string;
  readonly password: string;
}
