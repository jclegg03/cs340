// AI-assisted: see AI-ATTRIBUTION.md

// Plain-data form of a User, safe to send as JSON between the frontend and the
// server. Convert with `user.dto` and `User.fromDto(dto)`.
export interface UserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly alias: string;
  readonly imageUrl: string;
}
