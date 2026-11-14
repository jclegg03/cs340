// AI-assisted: see AI-ATTRIBUTION.md

import { UserDto } from "../../dto/UserDto";

// Body the getUser endpoint sends back. user is null when no user has that alias.
// The getUser lambda must return this type, and the frontend reads the response as this type.
export interface GetUserResponse {
  readonly user: UserDto | null;
}
