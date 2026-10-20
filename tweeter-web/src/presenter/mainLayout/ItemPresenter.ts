import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { Presenter, View } from "../presenter";
import { Service } from "../../model.service/Service";

export interface ItemView<T> extends View {
    addItems: (items: T[]) => void
}

export const PAGE_SIZE = 10;

export abstract class ItemPresenter<T, U extends Service> extends Presenter<ItemView<T>> {
    private _hasMoreItems = true;
    private _lastItem: T | null = null;

    private userService: UserService = new UserService();
    private _service: U;
    protected get service(): U {
        return this._service;
    }

    public constructor(view: ItemView<T>, ) {
        super(view);
        this._service = this.serviceFactory();
    }

    public async loadMoreItems(authToken: AuthToken, userAlias: string) {
        await this.tryAndCatch<void>({
            operation: async () => {
                const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

                this.hasMoreItems = hasMore;
                this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;
                this.view.addItems(newItems);
            },
            operationDescription: this.itemDescription()
        });
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return this.userService.getUser(authToken, alias);
    }

    public reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    protected abstract itemDescription(): string;
    protected abstract serviceFactory(): U
    protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(item: T | null) {
        this._lastItem = item;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }
}