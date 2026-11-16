// AI-assisted: see AI-ATTRIBUTION.md
import {
    AuthToken,
    Status,
    PagedItemRequest,
    PagedItemResponse,
    StatusDto,
    PostStatusRequest,
    PostStatusResponse,
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
        const data = await this.callApi<PostStatusResponse, PostStatusRequest>(
            "postStatus",
            "POST",
            { authToken: authToken.dto, newStatus: newStatus.dto }
        );

        if (!data.success) {
            throw new Error("Posting the status failed");
        }
    }

    // Feed and story are paged the same way; only the endpoint differs.
    private async loadPageOfStatuses(
        endpoint: string,
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean]> {
        const data = await this.callApi<
            PagedItemResponse<StatusDto>,
            PagedItemRequest<StatusDto>
        >(
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