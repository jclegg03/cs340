import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../../model.service/FollowService";
import { LoadingView, MessageView, Presenter } from "../presenter";

export interface UserInfoView extends LoadingView, MessageView {
    setIsFollower: (isFollower: boolean) => void,
    setFolloweeCount: (count: number) => void,
    setFollowerCount: (count: number) => void
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
    private followService = new FollowService()

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User,
    ) {
        await this.doFollowServiceOperation(async () => currentUser === displayedUser ? false : this.followService.getIsFollowerStatus(authToken, currentUser, displayedUser), this.view.setIsFollower, "determine follower status");
    }

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User,
    ) {
        await this.doFollowServiceOperation(() => this.followService.getFolloweeCount(authToken, displayedUser), this.view.setFolloweeCount, "followees count");
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User,
    ) {
        await this.doFollowServiceOperation(() => this.followService.getFollowerCount(authToken, displayedUser), this.view.setFollowerCount, "get followers count");
    }

    private async doFollowServiceOperation<T>(serviceMethod: () => Promise<T>, viewMethod: (num: T) => void, description: string) {
        await this.tryAndCatch({
            operation: async () => viewMethod(await serviceMethod()),
            operationDescription: description
        });
    }

    public async followUser(authToken: AuthToken, user: User) {
        await this.followOperation(user, async () => await this.followService.follow(authToken, user), "follow", true);
    }

    public async unfollowUser(authToken: AuthToken, user: User) {
        await this.followOperation(user, async () => this.followService.unfollow(authToken, user), "unfollow", false);
    }

    private async followOperation(user: User, serviceFunction: () => Promise<[number, number]>,
        operationName: string, isFollower: boolean
) {
        var toastId = "";
        await this.tryAndCatch({
            operation: async () => {
                this.view.setIsLoading(true);
                toastId = this.view.displayInfoMessage(`${operationName}ing ${user.name}...`, 0);

                const [followerCount, followeeCount] = await serviceFunction();

                this.view.setIsFollower(isFollower);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            operationDescription: `${operationName} user`,
            finalOperation: async () => {
                this.view.deleteMessage(toastId);
                this.view.setIsLoading(false);
            }
        });
    }

    public areUsersEqual(user1: User, user2: User) {
        return user1.equals(user2);
    }
}