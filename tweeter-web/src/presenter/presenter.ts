export interface View {
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
}

export interface MessageDeletionView extends View {
    deleteMessage: (messageId: string) => void
}

export abstract class Presenter<T extends View> {
    protected constructor(private _view: T) { }
    public async tryAndCatch(operation: () => Promise<void>, operationDescription: string) {
        try {
            await operation();
        } catch (error) {
            this.view.displayErrorMessage(`Failed to ${operationDescription} because of exception: ${error}`);
        }
    };

    protected get view() {
        return this._view;
    }
}