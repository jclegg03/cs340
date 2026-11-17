// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";

// Body the frontend sends to the getUser endpoint: who is asking, and which user to look up.
export interface GetUserRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly alias: string;
}
