/**
 * @jest-environment node
 */
// AI-assisted: see AI-ATTRIBUTION.md

// Integration tests: these call StatusService, which goes through the ServerFacade
// to the real deployed server, so the backend must be built and deployed
// (terraform apply) for them to pass. They run in Jest's node environment because
// jsdom has no fetch.
//
// The server has no storage yet and returns FakeData, so expectations use the
// values from FakeData. Fake statuses have fixed timestamps, so the server's
// pages match the ones worked out from FakeData here.

import { FakeData, Status, StatusDto } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";

// Calls go over the network, and a cold Lambda can take a few seconds to start.
jest.setTimeout(15000);

describe("StatusService integration tests", () => {
  let statusService: StatusService;

  const authToken = FakeData.instance.authToken;
  const userAlias = FakeData.instance.firstUser!.alias;

  // The page the server should send back, worked out from the same FakeData.
  const expectedPage = (
    pageSize: number,
    lastItem: Status | null,
  ): [StatusDto[], boolean] => {
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(
      lastItem,
      pageSize,
    );
    return [statuses.map((status) => status.dto), hasMore];
  };

  beforeAll(() => {
    // ClientCommunicator logs every request body and URL; keep test output readable.
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    statusService = new StatusService();
  });

  describe("loadMoreStoryItems", () => {
    it("returns the first page of the user's story", async () => {
      const [statuses, hasMore] = await statusService.loadMoreStoryItems(
        authToken,
        userAlias,
        10,
        null,
      );

      const [expectedStatuses, expectedHasMore] = expectedPage(10, null);
      expect(statuses).toHaveLength(10);
      expect(statuses.map((status) => status.dto)).toEqual(expectedStatuses);
      expect(hasMore).toBe(expectedHasMore);
      expect(hasMore).toBe(true);

      // The service hands back real Status objects, with their post segments
      // (mentions, links, newlines) rebuilt from the post text.
      statuses.forEach((status) => {
        expect(status).toBeInstanceOf(Status);
        expect(status.segments.length).toBeGreaterThan(0);
      });
    });

    it("returns the next page, starting after lastItem", async () => {
      const [firstPage] = await statusService.loadMoreStoryItems(
        authToken,
        userAlias,
        10,
        null,
      );
      const lastItem = firstPage[firstPage.length - 1];

      const [statuses, hasMore] = await statusService.loadMoreStoryItems(
        authToken,
        userAlias,
        10,
        lastItem,
      );

      const [expectedStatuses, expectedHasMore] = expectedPage(10, lastItem);
      expect(statuses.map((status) => status.dto)).toEqual(expectedStatuses);
      expect(hasMore).toBe(expectedHasMore);

      // No status from the first page shows up again.
      statuses.forEach((status) =>
        expect(firstPage.some((earlier) => earlier.equals(status))).toBe(false),
      );
    });
  });
});
