// AI-assisted: see AI-ATTRIBUTION.md

import { AuthTokenDto } from "../../dto/AuthTokenDto";

// Body the frontend sends to the getUser endpoint: who is asking, and which user to look up.
export interface GetUserRequest {
  readonly authToken: AuthTokenDto;
  readonly alias: string;
}
