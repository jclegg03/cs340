// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterResponse } from "./TweeterResponse";

// Body the postStatus endpoint sends back. The postStatus lambda must return this
// type, and the frontend reads the response as this type.
export interface PostStatusResponse extends TweeterResponse {}
