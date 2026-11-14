// AI-assisted: see AI-ATTRIBUTION.md

// Body the frontend sends to the register endpoint.
export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly password: string;
  // The profile image's bytes, base64-encoded so they can travel as JSON.
  readonly userImageBase64: string;
  // e.g. "png" or "jpg"
  readonly imageFileExtension: string;
}
