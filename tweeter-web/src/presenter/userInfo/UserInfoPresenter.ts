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
        this.tryAndCatch<void>({
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
        this.tryAndCatch<void>({
            operation: async () => this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser)),
            operationDescription: "followees count"
        });
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User,
    ) {
        this.tryAndCatch<void>({
            operation: async () => this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser)),
            operationDescription: "get followers count"
        });
    }

    public async followUser(authToken: AuthToken, user: User) {
        var followingUserToast = "";
        this.tryAndCatch({
            operation: async () => {
                this.view.setIsLoading(true);
                followingUserToast = this.view.displayInfoMessage(`Following ${user.name}...`, 0);

                const [followerCount, followeeCount] = await this.followService.follow(
                    authToken,
                    user,
                );

                this.view.setIsFollower(true);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            operationDescription: "follow user",
            finalOperation: async () => {
                this.view.deleteMessage(followingUserToast);
                this.view.setIsLoading(false);
            }
        });
    }

    public async unfollowUser(authToken: AuthToken, user: User) {
        var unfollowingUserToast = "";
        this.tryAndCatch({
            operation: async () => {
                this.view.setIsLoading(true);
                unfollowingUserToast = this.view.displayInfoMessage(`Unfollowing ${user!.name}...`, 0);

                const [followerCount, followeeCount] = await this.followService.unfollow(
                    authToken,
                    user,
                );

                this.view.setIsFollower(false);
                this.view.setFollowerCount(followerCount);
                this.view.setFolloweeCount(followeeCount);
            },
            operationDescription: "unfollow user",
            finalOperation: async () => {
                this.view.deleteMessage(unfollowingUserToast);
                this.view.setIsLoading(false);
            }
        });
    }

    public areUsersEqual(user1: User, user2: User) {
        return user1.equals(user2);
    }
}