import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model.service/UserService";
import { Presenter, MessageView } from "../presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void,
  navigateToLogin: () => void
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private _userService = new UserService();
  public get userService() {
    return this._userService;
  }
  public set userService(value) {
    this._userService = value;
  }

  public updateUserInfo() { return this.userService.updateUserInfo(); }
  public setDisplayedUser() { return this.userService.setDisplayedUser(); }

  public async logOut(authToken: AuthToken): Promise<void> {
    const loggingOutToastId = this.view.displayInfoMessage("Logging Out...", 0);
    return await this.tryAndCatch({
      operation: async () => {
        await this.logout(authToken);

        this.view.deleteMessage(loggingOutToastId);
        this.view.clearUserInfo();
        this.view.navigateToLogin();
      }, 
      operationDescription: "log user out"
  });
  };

  private async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await this.userService.logout(authToken);
  };
}