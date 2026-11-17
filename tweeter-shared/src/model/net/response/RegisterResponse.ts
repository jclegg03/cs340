// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterResponse } from "./TweeterResponse";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";

// Body the register endpoint sends back. The register lambda must return this type,
// and the frontend reads the response as this type.
export interface RegisterResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly authToken: AuthTokenDto;
}
