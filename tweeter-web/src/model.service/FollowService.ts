// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User } from "tweeter-shared";
import { Service } from "./Service";

export class FollowService extends Service {
    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return this.serverFacade.getMoreFollowees({
            authToken: authToken.dto,
            userAlias,
            pageSize,
            lastItem: lastItem ? lastItem.dto : null,
        });
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return this.serverFacade.getMoreFollowers({
            authToken: authToken.dto,
            userAlias,
            pageSize,
            lastItem: lastItem ? lastItem.dto : null,
        });
    }

    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User,
    ): Promise<boolean> {
        return this.serverFacade.getIsFollowerStatus({
            authToken: authToken.dto,
            user: user.dto,
            selectedUser: selectedUser.dto,
        });
    }

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        return this.serverFacade.getFolloweeCount({
            authToken: authToken.dto,
            user: user.dto,
        });
    }

    public async getFollowerCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        return this.serverFacade.getFollowerCount({
            authToken: authToken.dto,
            user: user.dto,
        });
    }

    public async follow(
        authToken: AuthToken,
        userToFollow: User,
    ): Promise<[followerCount: number, followeeCount: number]> {
        return this.serverFacade.follow({
            authToken: authToken.dto,
            user: userToFollow.dto,
        });
    };

    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User,
    ): Promise<[followerCount: number, followeeCount: number]> {
        return this.serverFacade.unfollow({
            authToken: authToken.dto,
            user: userToUnfollow.dto,
        });
    }
}
