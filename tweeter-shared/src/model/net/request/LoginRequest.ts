// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterRequest } from "./TweeterRequest";

// Body the frontend sends to the login endpoint.
export interface LoginRequest extends TweeterRequest {
  readonly alias: string;
  readonly password: string;
}
