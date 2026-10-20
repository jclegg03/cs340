import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { Presenter, AllMessageView } from "../presenter";

export interface AppNavbarView extends AllMessageView {
  clearUserInfo: () => void
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private userService = new UserService();

  public constructor(view: AppNavbarView) {
    super(view);
  }

  public updateUserInfo() { return this.userService.updateUserInfo(); }
  public setDisplayedUser() { return this.userService.setDisplayedUser(); }

  public async logOut(authToken: AuthToken): Promise<boolean> {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    return await this.tryAndCatch<boolean>({
      operation: async () => {
        await this.logout(authToken);

        this.view.deleteMessage(loggingOutToastId);
        this.view.clearUserInfo();
        return true;
      }, 
      operationDescription: "log user out",
      failureOperation: async () => false
  });
  };

  private async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };
}