// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterResponse } from "./TweeterResponse";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

// Body the login endpoint sends back. The login lambda must return this type,
// and the frontend reads the response as this type.
export interface LoginResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly authToken: AuthTokenDto;
}
