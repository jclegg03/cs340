import { Toast } from "../../components/toaster/Toast";

export interface View {
    deleteMessage: (messageId: string) => void
}

export class ToasterPresenter {
    constructor(private view: View) { }

    public deleteMessage(id: string) {
        this.view.deleteMessage(id);
    }

    public deleteExpiredToasts(messageList: Toast[]) {
        const now = Date.now();

        for (let message of messageList) {
            if (
                message.expirationMillisecond > 0 &&
                message.expirationMillisecond < now
            ) {
                this.view.deleteMessage(message.id);
            }
        }
    }
}