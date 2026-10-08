import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../../model.service/FollowService";

export interface View {
    setIsFollower: (isFollower: boolean) => void,
    setFolloweeCount: (count: number) => void,
    setFollowerCount: (count: number) => void,
    setIsLoading: (isLoading: boolean) => void,
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string,
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string,
    deleteMessage: (messageId: string) => void
}

export class UserInfoPresenter {
    private followService = new FollowService()
    constructor(private view: View) { }

    public async setIsFollowerStatus(
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User,
    ) {
        try {
            if (currentUser === displayedUser) {
                this.view.setIsFollower(false);
            } else {
                this.view.setIsFollower(
                    await this.followService.getIsFollowerStatus(authToken, currentUser, displayedUser),
                );
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to determine follower status because of exception: ${error}`);
        }
    }

    public async setNumbFollowees(
        authToken: AuthToken,
        displayedUser: User,
    ) {
        try {
            this.view.setFolloweeCount(await this.followService.getFolloweeCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get followees count because of exception: ${error}`);
        }
    }

    public async setNumbFollowers(
        authToken: AuthToken,
        displayedUser: User,
    ) {
        try {
            this.view.setFollowerCount(await this.followService.getFollowerCount(authToken, displayedUser));
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get followers count because of exception: ${error}`);
        }
    }

    public async followUser(authToken: AuthToken, user: User) {
        var followingUserToast = "";

        try {
            this.view.setIsLoading(true);
            followingUserToast = this.view.displayInfoMessage(`Following ${user.name}...`, 0);

            const [followerCount, followeeCount] = await this.followService.follow(
                authToken,
                user,
            );

            this.view.setIsFollower(true);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
        } finally {
            this.view.deleteMessage(followingUserToast);
            this.view.setIsLoading(false);
        }
    }

    public async unfollowUser(authToken: AuthToken, user: User) {
        var unfollowingUserToast = "";

        try {
            this.view.setIsLoading(true);
            unfollowingUserToast = this.view.displayInfoMessage(`Unfollowing ${user!.name}...`, 0);

            const [followerCount, followeeCount] = await this.followService.unfollow(
                authToken,
                user,
            );

            this.view.setIsFollower(false);
            this.view.setFollowerCount(followerCount);
            this.view.setFolloweeCount(followeeCount);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
        } finally {
            this.view.deleteMessage(unfollowingUserToast);
            this.view.setIsLoading(false);
        }
    }

    public areUsersEqual(user1: User, user2: User) {
        return user1.equals(user2);
    }
}