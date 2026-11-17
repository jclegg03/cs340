// AI-assisted: see AI-ATTRIBUTION.md
import {
  AuthToken,
  FollowRequest,
  FollowResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  IsFollowerResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  PostStatusResponse,
  RegisterRequest,
  RegisterResponse,
  Status,
  StatusDto,
  TweeterRequest,
  TweeterResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

// The only place the frontend talks to the server. Each method sends a request
// body to one endpoint and converts the DTOs in the response into domain objects.
export class ServerFacade {
  private SERVER_URL =
    "https://u74wryiyf1.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  // ---------- Users ----------

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.post<LoginRequest, LoginResponse>(
      request,
      "/login",
    );
    return this.toUserAndToken(response, "Invalid alias or password");
  }

  public async register(
    request: RegisterRequest,
  ): Promise<[User, AuthToken]> {
    const response = await this.post<RegisterRequest, RegisterResponse>(
      request,
      "/register",
    );
    return this.toUserAndToken(response, "Invalid registration");
  }

  public async logout(request: LogoutRequest): Promise<void> {
    await this.post<LogoutRequest, LogoutResponse>(request, "/logout");
  }

  // Returns null when no user has the alias.
  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.post<GetUserRequest, GetUserResponse>(
      request,
      "/getUser",
    );
    return User.fromDto(response.user);
  }

  // ---------- Follows ----------

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
    return this.getPageOfUsers(request, "/loadMoreFollowees", "followees");
  }

  public async getMoreFollowers(
    request: PagedItemRequest<UserDto>,
  ): Promise<[User[], boolean]> {
    return this.getPageOfUsers(request, "/loadMoreFollowers", "followers");
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest,
  ): Promise<boolean> {
    const response = await this.post<IsFollowerRequest, IsFollowerResponse>(
      request,
      "/isFollower",
    );
    return response.isFollower;
  }

  public async getFolloweeCount(
    request: GetFollowCountRequest,
  ): Promise<number> {
    const response = await this.post<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/getFolloweeCount");
    return response.count;
  }

  public async getFollowerCount(
    request: GetFollowCountRequest,
  ): Promise<number> {
    const response = await this.post<
      GetFollowCountRequest,
      GetFollowCountResponse
    >(request, "/getFollowerCount");
    return response.count;
  }

  public async follow(
    request: FollowRequest,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.post<FollowRequest, FollowResponse>(
      request,
      "/follow",
    );
    return [response.followerCount, response.followeeCount];
  }

  public async unfollow(
    request: FollowRequest,
  ): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.post<FollowRequest, FollowResponse>(
      request,
      "/unfollow",
    );
    return [response.followerCount, response.followeeCount];
  }

  // ---------- Statuses ----------

  public async getMoreFeedItems(
    request: PagedItemRequest<StatusDto>,
  ): Promise<[Status[], boolean]> {
    return this.getPageOfStatuses(request, "/loadMoreFeedItems", "feed items");
  }

  public async getMoreStoryItems(
    request: PagedItemRequest<StatusDto>,
  ): Promise<[Status[], boolean]> {
    return this.getPageOfStatuses(
      request,
      "/loadMoreStoryItems",
      "story items",
    );
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    await this.post<PostStatusRequest, PostStatusResponse>(
      request,
      "/postStatus",
    );
  }

  // ---------- Helpers ----------

  // Sends the request and returns the response, or throws with the server's
  // message when the response says the request failed.
  private async post<REQ extends TweeterRequest, RES extends TweeterResponse>(
    request: REQ,
    endpoint: string,
  ): Promise<RES> {
    const response = await this.clientCommunicator.doPost<REQ, RES>(
      request,
      endpoint,
    );

    if (response.success) {
      return response;
    } else {
      console.error(response);
      throw new Error(response.message ?? undefined);
    }
  }

  private toUserAndToken(
    response: LoginResponse | RegisterResponse,
    errorMessage: string,
  ): [User, AuthToken] {
    const user = User.fromDto(response.user);
    const authToken = AuthToken.fromDto(response.authToken);

    if (user === null || authToken === null) {
      throw new Error(errorMessage);
    }

    return [user, authToken];
  }

  private async getPageOfUsers(
    request: PagedItemRequest<UserDto>,
    endpoint: string,
    description: string,
  ): Promise<[User[], boolean]> {
    const response = await this.post<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, endpoint);

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null = response.items
      ? response.items.map((dto) => User.fromDto(dto) as User)
      : null;

    if (items == null) {
      throw new Error(`No ${description} found`);
    }
    return [items, response.hasMore];
  }

  private async getPageOfStatuses(
    request: PagedItemRequest<StatusDto>,
    endpoint: string,
    description: string,
  ): Promise<[Status[], boolean]> {
    const response = await this.post<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, endpoint);

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null = response.items
      ? response.items.map((dto) => Status.fromDto(dto) as Status)
      : null;

    if (items == null) {
      throw new Error(`No ${description} found`);
    }
    return [items, response.hasMore];
  }
}
