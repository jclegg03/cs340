import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface View {
    setDisplayedUser: (user: User) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string
}

export class NavigateToUserPresenter {
    private userService = new UserService();
    constructor(private view: View) { }

    public async canNavigateToUser(userString: string, authToken: AuthToken, displayedUser: User): Promise<string | null> {
        try {
            const alias = this.extractAlias(userString);

            const toUser = await this.userService.getUser(authToken, alias);

            if (toUser) {
                if (!toUser.equals(displayedUser!)) {
                    this.view.setDisplayedUser(toUser);
                }
            }
        } catch (error) {
            this.view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }

        return null;
    }

    private extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}