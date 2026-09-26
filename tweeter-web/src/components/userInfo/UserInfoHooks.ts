import { useContext } from "react"
import { UserInfoActionsContext, UserInfoContext } from "./UserInfoContexts"

export const useUserInfoActions = () => useContext(UserInfoActionsContext);
export const useUserInfo = () => useContext(UserInfoContext);