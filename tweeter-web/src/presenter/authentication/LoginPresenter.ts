import { AuthPresenter, AuthView } from "./AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView> {

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