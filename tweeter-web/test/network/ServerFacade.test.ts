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

import {
  AuthToken,
  FakeData,
  GetFollowCountRequest,
  PagedItemRequest,
  RegisterRequest,
  User,
  UserDto,
} from "tweeter-shared";
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

  describe("getMoreFollowers", () => {
    const userAlias = "@allen";

    const followersRequest = (
      pageSize: number,
      lastItem: User | null,
    ): PagedItemRequest<UserDto> => ({
      authToken: FakeData.instance.authToken.dto,
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    });

    // The page the server should send back, worked out from the same FakeData.
    const expectedPage = (
      pageSize: number,
      lastItem: User | null,
    ): [UserDto[], boolean] => {
      const [users, hasMore] = FakeData.instance.getPageOfUsers(
        lastItem,
        pageSize,
        userAlias,
      );
      return [users.map((user) => user.dto), hasMore];
    };

    it("returns the first page of followers", async () => {
      const [followers, hasMore] = await serverFacade.getMoreFollowers(
        followersRequest(10, null),
      );

      const [expectedFollowers, expectedHasMore] = expectedPage(10, null);
      expect(followers).toHaveLength(10);
      followers.forEach((follower) => expect(follower).toBeInstanceOf(User));
      expect(followers.map((follower) => follower.dto)).toEqual(
        expectedFollowers,
      );
      expect(hasMore).toBe(expectedHasMore);
      expect(hasMore).toBe(true);
    });

    it("returns the page after lastItem", async () => {
      const lastItem = FakeData.instance.findUserByAlias("@bonnie")!;

      const [followers, hasMore] = await serverFacade.getMoreFollowers(
        followersRequest(5, lastItem),
      );

      const [expectedFollowers, expectedHasMore] = expectedPage(5, lastItem);
      expect(followers.map((follower) => follower.dto)).toEqual(
        expectedFollowers,
      );
      expect(followers[0].alias).toBe("@chris");
      expect(hasMore).toBe(expectedHasMore);
    });

    it("reports no more followers on the last page", async () => {
      const lastItem = FakeData.instance.findUserByAlias("@jill")!;

      const [followers, hasMore] = await serverFacade.getMoreFollowers(
        followersRequest(10, lastItem),
      );

      const [expectedFollowers] = expectedPage(10, lastItem);
      expect(followers.map((follower) => follower.dto)).toEqual(
        expectedFollowers,
      );
      expect(followers.map((follower) => follower.alias)).toEqual([
        "@kent",
        "@kathy",
      ]);
      expect(hasMore).toBe(false);
    });
  });

  // Followee count = how many users this user is following.
  describe("getFolloweeCount", () => {
    const request: GetFollowCountRequest = {
      authToken: FakeData.instance.authToken.dto,
      user: FakeData.instance.firstUser!.dto,
    };

    it("returns the user's followee count", async () => {
      const count = await serverFacade.getFolloweeCount(request);

      // FakeData picks a random whole number from 1 to 10, so check the range.
      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(10);
    });
  });

  // Follower count = how many users follow this user.
  describe("getFollowerCount", () => {
    const request: GetFollowCountRequest = {
      authToken: FakeData.instance.authToken.dto,
      user: FakeData.instance.firstUser!.dto,
    };

    it("returns the user's follower count", async () => {
      const count = await serverFacade.getFollowerCount(request);

      // FakeData picks a random whole number from 1 to 10, so check the range.
      expect(Number.isInteger(count)).toBe(true);
      expect(count).toBeGreaterThanOrEqual(1);
      expect(count).toBeLessThanOrEqual(10);
    });
  });
});
