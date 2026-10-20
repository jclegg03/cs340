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
    constructor(view: UserInfoView) {
        super(view);
    }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User,
    ) {
        await this.tryAndCatch<void>({
            operation: async () => {
                if (currentUser === displayedUser) {
                    this.view.setIsFollower(false);
                } else {
                    this.view.setIsFollower(
                        await this.followService.getIsFollowerStatus(authToken, currentUser, displayedUser),
                    );
                }
            },
            operationDescription: "determine follower status"
        });
    }

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User,
    ) {
        await this.setFollowerCounts(() => this.followService.getFolloweeCount(authToken, displayedUser), this.view.setFolloweeCount, "followees count");
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User,
    ) {
        await this.setFollowerCounts(() => this.followService.getFollowerCount(authToken, displayedUser), this.view.setFollowerCount, "get followers count");
    }

    private async setFollowerCounts(serviceMethod: () => Promise<number>, viewMethod: (num: number) => void, description: string) {
        await this.tryAndCatch({
            operation: async () => viewMethod(await serviceMethod()),
            operationDescription: description
        });
    }

    public async followUser(authToken: AuthToken, user: User) {
        await this.followOperation(user, async () => await this.followService.follow(authToken, user));
    }

    public async unfollowUser(authToken: AuthToken, user: User) {
        await this.followOperation(user, async () => this.followService.unfollow(authToken, user));
    }

    private async followOperation(user: User, serviceFunction: () => Promise<[number, number]>) {
        var toastId = "";
        await this.tryAndCatch({
            operation: async () => {
                this.view.setIsLoading(true);
                toastId = this.view.displayInfoMessage(`Unfollowing ${user.name}...`, 0);

                const [followerCount, followeeCount] = await serviceFunction();

                this.view.setIsFollower(false);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            operationDescription: "unfollow user",
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