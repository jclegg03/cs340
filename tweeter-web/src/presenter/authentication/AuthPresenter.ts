import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { LoadingView, Presenter } from "../presenter";

export interface AuthView extends LoadingView {
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
}

export abstract class AuthPresenter extends Presenter<AuthView> {
    private _userService = new UserService();
    private _rememberMe = false;

    public async serviceAction<T>(serviceCall: () => Promise<[User, AuthToken]>, description: string, failureRet: T, postCall: (user: User) => T): Promise<T> {
        return await this.tryAndCatch<T>({
            operation: async () => {
                this.view.setIsLoading(true);

                const [user, authToken] = await serviceCall();

                this.view.updateUserInfo(user, user, authToken, this.rememberMe);
                return postCall(user);
            },
            operationDescription: "log user in",
            failureOperation: async () => failureRet,
            finalOperation: async () => this.view.setIsLoading(false)
        }
        )
    }

    protected get userService() {
        return this._userService;
    }

    public get rememberMe() {
        return this._rememberMe;
    }

    public set rememberMe(rememberMe: boolean) {
        this._rememberMe = rememberMe;
    }
}