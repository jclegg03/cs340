import { AuthToken } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export const PAGE_SIZE = 10;

export class FeedPresenter extends StatusItemPresenter {
    constructor(view: StatusItemView) {
        super(view);
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        this.tryAndCatch(async () => {
            const [newItems, hasMore] = await this.statusService.loadMoreFeedItems(
                authToken!,
                userAlias,
                PAGE_SIZE,
                this.lastItem
            );

            this.hasMoreItems = hasMore;
            this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
            this.view.addItems(newItems);
        }, "load feed items")
    };
}