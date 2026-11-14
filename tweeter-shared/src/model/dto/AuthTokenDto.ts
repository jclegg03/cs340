// AI-assisted: see AI-ATTRIBUTION.md

// Plain-data form of an AuthToken, safe to send as JSON between the frontend
// and the server. Convert with `authToken.dto` and `AuthToken.fromDto(dto)`.
export interface AuthTokenDto {
  readonly token: string;
  readonly timestamp: number;
}
