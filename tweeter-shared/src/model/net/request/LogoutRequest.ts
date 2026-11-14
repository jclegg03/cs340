// AI-assisted: see AI-ATTRIBUTION.md

import { AuthTokenDto } from "../../dto/AuthTokenDto";

// Body the frontend sends to the logout endpoint: the token of the session to end.
export interface LogoutRequest {
  readonly authToken: AuthTokenDto;
}
