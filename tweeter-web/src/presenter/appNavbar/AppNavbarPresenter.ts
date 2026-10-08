import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";

export interface AppNavbarView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string,
    deleteMessage: (messageId: string) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string,
    clearUserInfo: () => void
}

export class AppNavbarPresenter {
    private userService = new UserService();

    public constructor(private view: AppNavbarView) {}

    public updateUserInfo() { return this.userService.updateUserInfo(); }
    public setDisplayedUser() { return this.userService.setDisplayedUser(); }

    public async logOut (authToken: AuthToken): Promise<boolean> {
        const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    
        try {
          await this.logout(authToken);
    
          this.view.deleteMessage(loggingOutToastId);
          this.view.clearUserInfo();
          return true;
        } catch (error) {
          this.view.displayErrorMessage(`Failed to log user out because of exception: ${error}`);
          return false;
        }
      };
    
      private async logout(authToken: AuthToken): Promise<void> {
        // Pause so we can see the logging out message. Delete when the call to the server is implemented.
        await new Promise((res) => setTimeout(res, 1000));
      };
}