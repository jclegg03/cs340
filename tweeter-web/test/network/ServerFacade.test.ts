/**
 * @jest-environment node
 */
// AI-assisted: see AI-ATTRIBUTION.md

// Integration tests: these call the real deployed server through ServerFacade, so
// the backend must be built and deployed (terraform apply) for them to pass.
// They run in Jest's node environment because jsdom has no fetch.
//
// The server has no storage yet and returns FakeData, so expectations use the
// values from FakeData.

import { AuthToken, FakeData, RegisterRequest, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";

// Calls go over the network, and a cold Lambda can take a few seconds to start.
jest.setTimeout(15000);

describe("ServerFacade integration tests", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    // ClientCommunicator logs every request body and URL; keep test output readable.
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  describe("register", () => {
    const request: RegisterRequest = {
      firstName: "Allen",
      lastName: "Anderson",
      alias: "@allen",
      password: "password",
      // A few bytes of base64, standing in for a profile image.
      userImageBase64: "iVBORw0KGgo=",
      imageFileExtension: "png",
    };

    it("returns the registered user and an auth token", async () => {
      const [user, authToken] = await serverFacade.register(request);

      // The server returns FakeData's first user (Allen Anderson) for now.
      const expectedUser = FakeData.instance.firstUser!;
      expect(user).toBeInstanceOf(User);
      expect(user.dto).toEqual(expectedUser.dto);

      // The token is generated on the server, so only its shape can be checked.
      expect(authToken).toBeInstanceOf(AuthToken);
      expect(typeof authToken.token).toBe("string");
      expect(authToken.token.length).toBeGreaterThan(0);
      expect(authToken.timestamp).toBeGreaterThan(0);
    });
  });
});
