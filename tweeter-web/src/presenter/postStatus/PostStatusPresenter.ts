import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model.service/StatusService";

export interface View {
    setPost: (post: string) => void,
    setIsLoading: (isLoading: boolean) => void,
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string,
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string,
    deleteMessage: (messageId: string) => void
}

export class PostStatusPresenter {
    private statusService = new StatusService();
    constructor(private view: View) { }

    public clearPost() {
        this.view.setPost("");
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        var postingStatusToastId = "";

        try {
            this.view.setIsLoading(true);
            postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

            const status = new Status(post, currentUser, Date.now());

            await this.statusService.postStatus(authToken, status);

            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
        } finally {
            this.view.deleteMessage(postingStatusToastId);
            this.view.setIsLoading(false);
        }
    }

    public checkButtonStatus(post: string, authToken: AuthToken | null, currentUser: User | null, isLoading: boolean) {
    return !post.trim() || !authToken || !currentUser || isLoading;
  };
}