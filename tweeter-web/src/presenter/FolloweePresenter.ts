import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserService } from "../model.service/UserService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
    private followService: FollowService = new FollowService();

    constructor(view: UserItemView) {
        super(view);
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        try {
            const [newItems, hasMore] = await this.followService.loadMoreFollowees(
                authToken,
                userAlias,
                PAGE_SIZE,
                this.lastItem
            );

            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to load followees because of exception: ${error}`);
        }
    };
}