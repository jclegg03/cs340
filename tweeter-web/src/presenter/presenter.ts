export interface View {
    displayErrorMessage: (message: string, bootstrapClasses?: string | undefined) => string
}

export interface MessageView extends View {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string;
    deleteMessage: (messageId: string) => void;
}

export interface LoadingView extends View {
    setIsLoading: (isLoading: boolean) => void
}

export interface TryAndCatchContext<T> {
    operation: () => Promise<T>;
    operationDescription: string;
    failureOperation?: () => Promise<T>;
    finalOperation?: () => Promise<void>;
}

export abstract class Presenter<T extends View> {
    public constructor(private _view: T) { }
    protected async tryAndCatch<T>(context: TryAndCatchContext<T>): Promise<T> {
        const {
            operation,
            operationDescription, 
            failureOperation = async () => undefined as T, 
            finalOperation  = async () => { }
        } = context;
        try {
            return await operation();
        } catch (error) {
            this.view.displayErrorMessage(`Failed to ${operationDescription} because of exception: ${error}`);
            return await failureOperation();
        } finally {
            await finalOperation();
        }
    };

    protected get view() {
        return this._view;
    }
}