export interface View {
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
}

export interface MessageDeletionView extends View {
    deleteMessage: (messageId: string) => void
}

export interface AllMessageView extends MessageDeletionView, MessageView {}

export abstract class Presenter<T extends View> {
    protected constructor(private _view: T) { }
    protected async tryAndCatch<T>(operation: () => Promise<T>, operationDescription: string, failureOperation: () => Promise<T> = async () => undefined as T): Promise<T> {
        try {
            return await operation();
        } catch (error) {
            this.view.displayErrorMessage(`Failed to ${operationDescription} because of exception: ${error}`);
            return await failureOperation();
        }
    };

    protected get view() {
        return this._view;
    }
}