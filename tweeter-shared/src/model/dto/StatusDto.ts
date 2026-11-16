// AI-assisted: see AI-ATTRIBUTION.md

import { UserDto } from "./UserDto";

// Plain-data form of a Status, safe to send as JSON between the frontend and the
// server. Segments are not included: Status rebuilds them from the post text.
// Convert with `status.dto` and `Status.fromDto(dto)`.
export interface StatusDto {
  readonly post: string;
  readonly user: UserDto;
  readonly timestamp: number;
}
