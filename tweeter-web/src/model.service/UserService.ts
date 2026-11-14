// AI-assisted: see AI-ATTRIBUTION.md
import {
    AuthToken,
    User,
    FakeData,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { Service } from "./Service";

export class UserService extends Service {
    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    }

    public updateUserInfo() { return null; }
    public clearUserInfo() { return null; }
    public setDisplayedUser() { return null; }

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken]> {
        const data = await this.callApi<LoginResponse, LoginRequest>(
            "login",
            "POST",
            { alias, password }
        );
        // The server sends DTOs (plain data); turn them back into real classes.
        const user = User.fromDto(data.user);
        const authToken = AuthToken.fromDto(data.authToken);

        if (user === null || authToken === null) {
            throw new Error("Invalid alias or password");
        }

        return [user, authToken];
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
    ): Promise<[User, AuthToken]> {
        // Image bytes are sent as base64 so they can travel inside the JSON body.
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        const data = await this.callApi<RegisterResponse, RegisterRequest>(
            "register",
            "POST",
            {
                firstName,
                lastName,
                alias,
                password,
                userImageBase64: imageStringBase64,
                imageFileExtension,
            }
        );
        // The server sends DTOs (plain data); turn them back into real classes.
        const user = User.fromDto(data.user);
        const authToken = AuthToken.fromDto(data.authToken);

        if (user === null || authToken === null) {
            throw new Error("Invalid registration");
        }

        return [user, authToken];
    };

    public async logout(authToken: AuthToken): Promise<void> {
        const data = await this.callApi<LogoutResponse, LogoutRequest>(
            "logout",
            "POST",
            { authToken: authToken.dto }
        );

        if (!data.success) {
            throw new Error("Logout failed");
        }
    }
}