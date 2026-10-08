import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";

export interface View {
    setIsLoading: (isLoading: boolean) => void,
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string
}

export class LoginPresenter {
    private userService = new UserService();
    private _rememberMe = false;
    constructor(private view: View) { }

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    }

    public async login(alias: string, password: string, originalUrl?: string): Promise<string> {
        try {
            this.view.setIsLoading(true);

            const [user, authToken] = await this.userService.login(alias, password);

            this.view.updateUserInfo(user, user, authToken, this.rememberMe);

            if (!!originalUrl) {
                return originalUrl;
            } else {
                return`/feed/${user.alias}`;
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
        } finally {
            this.view.setIsLoading(false);
        }
        return "";
    }

    public get rememberMe() {
        return this._rememberMe;
    }

    public set rememberMe(rememberMe: boolean) {
        this._rememberMe = rememberMe;
    }
}