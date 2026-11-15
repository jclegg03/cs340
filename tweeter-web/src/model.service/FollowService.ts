// AI-assisted: see AI-ATTRIBUTION.md
import {
    AuthToken,
    User,
    GetFollowCountRequest,
    GetFollowCountResponse,
    FollowRequest,
    FollowResponse,
    IsFollowerRequest,
    IsFollowerResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
} from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return this.loadPageOfUsers("loadMoreFollowees", authToken, userAlias, pageSize, lastItem);
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return this.loadPageOfUsers("loadMoreFollowers", authToken, userAlias, pageSize, lastItem);
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User,
    ): Promise<boolean> {
        const data = await this.callApi<IsFollowerResponse, IsFollowerRequest>(
            "isFollower",
            "POST",
            {
                authToken: authToken.dto,
                user: user.dto,
                selectedUser: selectedUser.dto,
            }
        );
        return data.isFollower;
    }

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        const data = await this.callApi<
            GetFollowCountResponse,
            GetFollowCountRequest
        >("getFolloweeCount", "POST", {
            authToken: authToken.dto,
            user: user.dto,
        });
        return data.count;
    }

    public async getFollowerCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        const data = await this.callApi<
            GetFollowCountResponse,
            GetFollowCountRequest
        >("getFollowerCount", "POST", {
            authToken: authToken.dto,
            user: user.dto,
        });
        return data.count;
    }

    public async follow(
        authToken: AuthToken,
        userToFollow: User,
    ): Promise<[followerCount: number, followeeCount: number]> {
        const data = await this.callApi<FollowResponse, FollowRequest>(
            "follow",
            "POST",
            { authToken: authToken.dto, user: userToFollow.dto }
        );
        return [data.followerCount, data.followeeCount];
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User,
    ): Promise<[followerCount: number, followeeCount: number]> {
        const data = await this.callApi<FollowResponse, FollowRequest>(
            "unfollow",
            "POST",
            { authToken: authToken.dto, user: userToUnfollow.dto }
        );
        return [data.followerCount, data.followeeCount];
    }

    // Followees and followers are paged the same way; only the endpoint differs.
    private async loadPageOfUsers(
        endpoint: string,
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        const data = await this.callApi<PagedUserItemResponse, PagedUserItemRequest>(
            endpoint,
            "POST",
            {
                authToken: authToken.dto,
                userAlias,
                pageSize,
                lastItem: lastItem ? lastItem.dto : null,
            }
        );
        // The server sends DTOs (plain data); turn them back into real Users.
        const users = data.items.map((dto) => User.fromDto(dto)!);
        return [users, data.hasMore];
    }
}
