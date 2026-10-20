import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../../../model.service/UserService";
import { StatusService } from "../../../model.service/StatusService";
import { Presenter, View } from "../../presenter";

export interface StatusItemView extends View {
    addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
    private _hasMoreItems = true;
    private _lastItem: Status | null = null;
    private userService: UserService = new UserService();
    private _statusService = new StatusService();
    
    constructor(view: StatusItemView) {
        super(view);
    }

    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;

    public reset() {
        this._lastItem = null;
        this._hasMoreItems = true;
    }

    public async getUser (
        authToken: AuthToken,
        alias: string
      ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return this.userService.getUser(authToken, alias);
      };

    protected get lastItem() {
        return this._lastItem;
    }

    protected set lastItem(item: Status | null) {
        this._lastItem = item;
    }

    protected set hasMoreItems(value: boolean) {
        this._hasMoreItems = value;
    }

    protected get statusService() {
        return this._statusService;
    }

    public get hasMoreItems() {
        return this._hasMoreItems;
    }
}