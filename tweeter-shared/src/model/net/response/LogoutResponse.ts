// AI-assisted: see AI-ATTRIBUTION.md

import { TweeterResponse } from "./TweeterResponse";

// Body the logout endpoint sends back. The logout lambda must return this type,
// and the frontend reads the response as this type.
export interface LogoutResponse extends TweeterResponse {}
