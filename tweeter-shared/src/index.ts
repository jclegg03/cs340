// AI-assisted: see AI-ATTRIBUTION.md
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";

// DTOs (plain data sent between the frontend and the server)
export type { UserDto } from "./model/dto/UserDto";
export type { AuthTokenDto } from "./model/dto/AuthTokenDto";

// Request/response bodies for the server API
export type { LoginRequest } from "./model/net/request/LoginRequest";
export type { LogoutRequest } from "./model/net/request/LogoutRequest";
export type { LoginResponse } from "./model/net/response/LoginResponse";
export type { LogoutResponse } from "./model/net/response/LogoutResponse";

// All classes that should be avaialble to other modules need to exported here. export * does not work when 
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "./util/FakeData";
