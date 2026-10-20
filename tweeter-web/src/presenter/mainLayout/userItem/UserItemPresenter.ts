import { AuthToken, User } from "tweeter-shared"
import { UserService } from "../../../model.service/UserService";
import { Presenter, View } from "../../presenter";

export interface UserItemView extends View {
    addItems: (items: User[]) => void
}

export abstract class UserItemPresenter extends Presenter<UserItemView>{
    private _hasMoreItems = true;
    private _lastItem: User | null = null;
    private userService: UserService = new UserService();

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