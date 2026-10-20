import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model.service/StatusService";
import { MessageView, LoadingView, Presenter } from "../presenter";

export interface PostStatusView extends MessageView, LoadingView {
    setPost: (post: string) => void
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
    private statusService = new StatusService();

    public clearPost() {
        this.view.setPost("");
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        var postingStatusToastId = "";
        await this.tryAndCatch<void>({
            operation: async () => {
                this.view.setIsLoading(true);
                postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

                const status = new Status(post, currentUser, Date.now());

                await this.statusService.postStatus(authToken, status);

                this.view.setPost("");
                this.view.displayInfoMessage("Status posted!", 2000);
            }, 
            operationDescription: "post the status", 
            finalOperation: async () => {
                this.view.deleteMessage(postingStatusToastId);
                this.view.setIsLoading(false);
            }
    });
    }

    public checkButtonStatus(post: string, authToken: AuthToken | null, currentUser: User | null, isLoading: boolean) {
        return !post.trim() || !authToken || !currentUser || isLoading;
    };
}