// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";

// There is no follow storage yet, so everything here comes from the fake data.
// TODO: check authToken in each method once auth tokens are stored server-side.
export class FollowService implements Service {
    public async loadMoreFollowees(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    }

    public async loadMoreFollowers(
        authToken: AuthToken,
        userAlias: string,
        pageSize: number,
        lastItem: User | null
    ): Promise<[User[], boolean]> {
        return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    }

    // Whether user follows selectedUser.
    public async getIsFollowerStatus(
        authToken: AuthToken,
        user: User,
        selectedUser: User,
    ): Promise<boolean> {
        return FakeData.instance.isFollower();
    }

    public async getFolloweeCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        return FakeData.instance.getFolloweeCount(user.alias);
    }

    public async getFollowerCount(
        authToken: AuthToken,
        user: User,
    ): Promise<number> {
        return FakeData.instance.getFollowerCount(user.alias);
    }

    // Returns userToFollow's counts after the follow.
    public async follow(
        authToken: AuthToken,
        userToFollow: User,
    ): Promise<[followerCount: number, followeeCount: number]> {
        // TODO: record the follow once storage exists.
        // TODO: make sure this calls the right functions to get the updated counts.
        const followerCount = await this.getFollowerCount(authToken, userToFollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

        return [followerCount, followeeCount];
    }

    // Returns userToUnfollow's counts after the unfollow.
    public async unfollow(
        authToken: AuthToken,
        userToUnfollow: User,
    ): Promise<[followerCount: number, followeeCount: number]> {
        // TODO: record the unfollow once storage exists.
        const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
        const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

        return [followerCount, followeeCount];
    }
}
