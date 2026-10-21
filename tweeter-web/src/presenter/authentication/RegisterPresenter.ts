import { Buffer } from 'buffer';
import { AuthPresenter, AuthView } from "./AuthPresenter";

export interface RegisterView extends AuthView {
    setImageUrl: (url: string) => void
}

export class RegisterPresenter extends AuthPresenter<RegisterView> {
    private _firstName = "";
    private _lastName = "";
    private _alias = "";
    private _password = "";
    private imageFileExtension = "";
    private imageBytes = new Uint8Array();

    public submitButtonEnabled(imageUrl: string) {
        return (
            !this.firstName ||
            !this.lastName ||
            !this.alias ||
            !this.password ||
            !imageUrl ||
            !this.imageFileExtension
        );
    }

    public async register(): Promise<string | null> {
        return await this.serviceAction(() => this.userService.register(
            this.firstName,
            this.lastName,
            this.alias,
            this.password,
            new Uint8Array(this.imageBytes),
            this.imageFileExtension
        ), "register user", null, (user) => user.alias);
    }

    public handleImageFile(file: File | undefined) {
        if (file) {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                this.imageBytes = new Uint8Array(Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                ));
            };
            reader.readAsDataURL(file);

            // Set image file extension (and move to a separate method)
            const fileExtension = this.getFileExtension(file);
            if (fileExtension) {
                this.imageFileExtension = fileExtension;
            }
        } else {
            this.view.setImageUrl("");
            this.imageBytes = new Uint8Array();
        }
    }

    private getFileExtension(file: File): string | undefined {
        return file.name.split(".").pop();
    }

    public get firstName() {
        return this._firstName;
    }
    public set firstName(firstName: string) {
        this._firstName = firstName;
    }

    public get lastName() {
        return this._lastName;
    }
    public set lastName(lastName: string) {
        this._lastName = lastName;
    }

    public get alias() {
        return this._alias;
    }
    public set alias(alias: string) {
        this._alias = alias;
    }

    public get password() {
        return this._password;
    }
    public set password(password) {
        this._password = password;
    }
}