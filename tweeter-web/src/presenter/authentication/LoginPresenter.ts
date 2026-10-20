import { AuthToken, User } from "tweeter-shared";
import { LoadingView } from "../presenter";
import { AuthPresenter } from "./AuthPresenter";

export interface LoginView extends LoadingView {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
}

export class LoginPresenter extends AuthPresenter {

    public checkSubmitButtonStatus(alias: string, password: string): boolean {
        return !alias || !password;
    }

    public async login(alias: string, password: string, originalUrl?: string): Promise<string> {
        return this.serviceAction(() => this.userService.login(alias, password), "log user in", "", (user) => {
            if (!!originalUrl) {
                    return originalUrl;
                } else {
                    return `/feed/${user.alias}`;
                }
        });
    }
}