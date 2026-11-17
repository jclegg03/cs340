// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

// Body the frontend sends to the logout endpoint: the token of the session to end.
export interface LogoutRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
}
