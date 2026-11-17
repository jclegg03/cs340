// AI-assisted: see AI-ATTRIBUTION.md
import { AuthToken, User, FakeData } from "tweeter-shared";
import { Service } from "./Service";

export class UserService implements Service {
    public async getUser(
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> {
        // TODO: check authToken once auth tokens are stored server-side.
        // There is no user storage yet, so this looks the alias up in the fake data.
        return FakeData.instance.findUserByAlias(alias);
    }

    // user is null when the alias and password don't match a user.
    public async login(
        alias: string,
        password: string
    ): Promise<[user: User | null, authToken: AuthToken]> {
        // TODO: check the alias and password once users are stored server-side.
        return [FakeData.instance.firstUser, FakeData.instance.authToken];
    }

    // user is null when registration fails.
    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBase64: string,
        imageFileExtension: string
    ): Promise<[user: User | null, authToken: AuthToken]> {
        // TODO: save the new user and upload the image once storage exists.
        // Until then this returns the fake first user.
        return [FakeData.instance.firstUser, FakeData.instance.authToken];
    }

    public async logout(authToken: AuthToken): Promise<void> {
        // TODO: invalidate authToken once auth tokens are stored server-side.
    }
}
