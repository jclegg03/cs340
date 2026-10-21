import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model.service/StatusService";
import { MessageView, LoadingView } from "../presenter";
import { LoadingPresenter } from "../LoadingPresenter";

export interface PostStatusView extends MessageView, LoadingView {
    setPost: (post: string) => void
}

export class PostStatusPresenter extends LoadingPresenter<PostStatusView> {
    private statusService = new StatusService();

    public clearPost() {
        this.view.setPost("");
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        var postingStatusToastId = "";
        await this.tryAndCatchWithLoading<void>({
            operation: async () => {
                postingStatusToastId = this.view.displayInfoMessage("Posting status...", 0);

                const status = new Status(post, currentUser, Date.now());

                await this.statusService.postStatus(authToken, status);

                this.view.setPost("");
                this.view.displayInfoMessage("Status posted!", 2000);
            }, 
            operationDescription: "post the status", 
            finalOperation: async () => {
                this.view.deleteMessage(postingStatusToastId);
            }
    });
    }

    public checkButtonStatus(post: string, authToken: AuthToken | null, currentUser: User | null, isLoading: boolean) {
        return !post.trim() || !authToken || !currentUser || isLoading;
    };
}