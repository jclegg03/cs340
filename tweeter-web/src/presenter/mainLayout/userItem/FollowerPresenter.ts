import { AuthToken } from "tweeter-shared";
import { FollowService } from "../../../model.service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export const PAGE_SIZE = 10;

export class FollowerPresenter extends UserItemPresenter {
    private followService: FollowService = new FollowService();

    constructor(view: UserItemView) {
        super(view);
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        this.tryAndCatch<void>({
            operation: async () => {
                const [newItems, hasMore] = await this.followService.loadMoreFollowers(
                    authToken,
                    userAlias,
                    PAGE_SIZE,
                    this.lastItem
                );

                this.hasMoreItems = hasMore;
                this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
                this.view.addItems(newItems);
            },
            operationDescription: "load followers"
        });
    };
}