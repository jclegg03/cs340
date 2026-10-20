import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { LoadingView, Presenter } from "../presenter";

export interface LoginView extends LoadingView {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
}

export class LoginPresenter extends Presenter<LoginView> {
    private userService = new UserService();
    private _rememberMe = false;
    constructor(view: LoginView) {
        super(view);
    }

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    }

    public async login(alias: string, password: string, originalUrl?: string): Promise<string> {
        return this.tryAndCatch<string>({
            operation: async () => {
                this.view.setIsLoading(true);

                const [user, authToken] = await this.userService.login(alias, password);

                this.view.updateUserInfo(user, user, authToken, this.rememberMe);

                if (!!originalUrl) {
                    return originalUrl;
                } else {
                    return `/feed/${user.alias}`;
                }
            },
            operationDescription: "log user in",
            failureOperation: async () => "",
            finalOperation: async () => this.view.setIsLoading(false)
        }
        )
    }

    public get rememberMe() {
        return this._rememberMe;
    }

    public set rememberMe(rememberMe: boolean) {
        this._rememberMe = rememberMe;
    }
}