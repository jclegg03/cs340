// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status, FakeData } from "tweeter-shared";
import { Service } from "./Service";

// There is no status storage yet, so pages come from the fake data.
// TODO: check authToken in each method once auth tokens are stored server-side.
export class StatusService implements Service {
    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        // TODO: use userAlias to load that user's story once statuses are stored.
        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    }

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        // TODO: use userAlias to load that user's feed once statuses are stored.
        return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status,
    ): Promise<void> {
        // TODO: save newStatus to the poster's story and their followers' feeds
        // once storage exists.
    }
}
