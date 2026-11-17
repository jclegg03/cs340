// AI-assisted: see AI-ATTRIBUTION.md
import { ServerFacade } from "../network/ServerFacade";

// Base class for the frontend services. Services build request bodies (converting
// domain objects to DTOs) and send them through the ServerFacade, which talks to
// the server and converts the response DTOs back into domain objects.
export class Service {
    protected serverFacade = new ServerFacade();
}
