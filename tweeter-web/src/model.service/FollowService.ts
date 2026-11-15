// AI-assisted: see AI-ATTRIBUTION.md
import {
    AuthToken,
    User,
    FakeData,
    GetFollowCountRequest,
    GetFollowCountResponse,
    FollowRequest,
    FollowResponse,
    IsFollowerRequest,
    IsFollowerResponse,
} from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
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
}
