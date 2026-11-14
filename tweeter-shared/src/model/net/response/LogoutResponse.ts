// AI-assisted: see AI-ATTRIBUTION.md

// Body the logout endpoint sends back. The logout lambda must return this type,
// and the frontend reads the response as this type.
export interface LogoutResponse {
  readonly success: boolean;
}
