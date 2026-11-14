// AI-assisted: see AI-ATTRIBUTION.md

import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

// Body the login endpoint sends back. The login lambda must return this type,
// and the frontend reads the response as this type.
export interface LoginResponse {
  readonly user: UserDto | null;
  readonly authToken: AuthTokenDto;
}
