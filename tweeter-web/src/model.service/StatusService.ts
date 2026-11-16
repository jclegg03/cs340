// AI-assisted: see AI-ATTRIBUTION.md
import {
    AuthToken,
    Status,
    PagedStatusItemRequest,
    PagedStatusItemResponse,
} from "tweeter-shared";
import { Service } from "./Service";

export class StatusService extends Service {
    public async loadMoreStoryItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.loadPageOfStatuses("loadMoreStoryItems", authToken, userAlias, pageSize, lastItem);
    }

    public async loadMoreFeedItems(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        return this.loadPageOfStatuses("loadMoreFeedItems", authToken, userAlias, pageSize, lastItem);
    }

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status,
    ): Promise<void> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
    }

    // Feed and story are paged the same way; only the endpoint differs.
    private async loadPageOfStatuses(
        endpoint: string,
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const data = await this.callApi<PagedStatusItemResponse, PagedStatusItemRequest>(
            endpoint,
            "POST",
            {
                authToken: authToken.dto,
                userAlias,
                pageSize,
                lastItem: lastItem ? lastItem.dto : null,
            }
        );
        // The server sends DTOs (plain data); turn them back into real Statuses.
        const statuses = data.items.map((dto) => Status.fromDto(dto)!);
        return [statuses, data.hasMore];
    }
}