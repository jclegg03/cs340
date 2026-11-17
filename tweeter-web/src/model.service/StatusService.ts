// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, Status } from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.serverFacade.getMoreStoryItems({
            authToken: authToken.dto,
            userAlias,
            pageSize,
            lastItem: lastItem ? lastItem.dto : null,
        });
    }

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.serverFacade.getMoreFeedItems({
            authToken: authToken.dto,
            userAlias,
            pageSize,
            lastItem: lastItem ? lastItem.dto : null,
        });
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status,
    ): Promise<void> {
        await this.serverFacade.postStatus({
            authToken: authToken.dto,
            newStatus: newStatus.dto,
        });
    }
}
