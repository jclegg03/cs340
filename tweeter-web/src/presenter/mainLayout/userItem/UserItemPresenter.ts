import { AuthToken, User } from "tweeter-shared"
import { UserService } from "../../../model.service/UserService";

export interface UserItemView {
    addItems: (items: User[]) => void
    displayErrorMessage: (message: string) => void
}

export abstract class UserItemPresenter {
    private _hasMoreItems = true;
    private _lastItem: User | null = null;
    private userService: UserService = new UserService();

    protected constructor(private _view: UserItemView) { }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

    public reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return this.userService.getUser(authToken, alias);
    }

    protected get view() {
        return this._view;
    }

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(item: User | null) {
        this._lastItem = item;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }
}