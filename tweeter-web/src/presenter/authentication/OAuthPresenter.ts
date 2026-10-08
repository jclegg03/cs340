export interface View {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string | undefined) => string
}

export class OAuthPresenter {
    constructor(private view: View) {}

    public onClick(name: string) {
        this.view.displayInfoMessage(
          name + " registration is not implemented.",
          3000,
          "text-white bg-primary"
        );
    }
}