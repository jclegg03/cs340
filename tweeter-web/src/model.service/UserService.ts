// AI-assisted: see AI-ATTRIBUTION.md
import {
    AuthToken,
    User,
    FakeData,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
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
        const res = await fetch(`${this.apiUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ alias, password }),
        });
        // The server sends DTOs (plain data); turn them back into real classes.
        const data: LoginResponse = await res.json();
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
        // Not neded now, but will be needed when you make the request to the server in milestone 3
        const imageStringBase64: string =
            Buffer.from(userImageBytes).toString("base64");

        // TODO: Replace with the result of calling the server
        const user = FakeData.instance.firstUser;

        if (user === null) {
            throw new Error("Invalid registration");
        }

        return [user, FakeData.instance.authToken];
    };

    public async logout(authToken: AuthToken): Promise<void> {
        const request: LogoutRequest = { authToken: authToken.dto };
        const res = await fetch(`${this.apiUrl}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });
        const data: LogoutResponse = await res.json();

        if (!res.ok || !data.success) {
            throw new Error("Logout failed");
        }
    }
}