// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterRequest } from "./TweeterRequest";
import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { StatusDto } from "../../dto/StatusDto";

// Body the frontend sends to the postStatus endpoint: who is posting, and the status to post.
export interface PostStatusRequest extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly newStatus: StatusDto;
}
