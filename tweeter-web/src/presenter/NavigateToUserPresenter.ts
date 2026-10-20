import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./presenter";

export interface NavigateToUserView extends View {
    setDisplayedUser: (user: User) => void
}

export class NavigateToUserPresenter extends Presenter<NavigateToUserView> {
    private userService = new UserService();

    public async canNavigateToUser(userString: string, authToken: AuthToken, displayedUser: User): Promise<string | null> {
        await this.tryAndCatch({
            operation: async () => {
                const alias = this.extractAlias(userString);

                const toUser = await this.userService.getUser(authToken, alias);

                if (toUser) {
                    if (!toUser.equals(displayedUser!)) {
                        this.view.setDisplayedUser(toUser);
                    }
                }
            },
            operationDescription: "get user"
        });

        return null;
    }

    private extractAlias(value: string): string {
        const index = value.indexOf("@");
        return value.substring(index);
    };
}