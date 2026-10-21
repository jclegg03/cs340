import { LoadingView, Presenter, TryAndCatchContext } from "./presenter";

export abstract class LoadingPresenter<T extends LoadingView> extends Presenter<T> {
    protected async tryAndCatchWithLoading<T>(context: TryAndCatchContext<T>): Promise<T> {
        return this.tryAndCatch({
            ...context,
            operation: () => {
                this.view.setIsLoading(true);
                return context.operation()
            },
            finalOperation: async () => {
                if(context.finalOperation) context.finalOperation();
                this.view.setIsLoading(false);
            }
        });
    };
}