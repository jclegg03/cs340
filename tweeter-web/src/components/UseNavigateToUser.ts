import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserInfoHooks";
import { useMessageActions } from "./toaster/MessageHooks";
import { useRef } from "react";
import { NavigateToUserPresenter } from "../presenter/NavigateToUserPresenter";

export const useNavigateToUser = (featurePath: string) => async (event: React.MouseEvent): Promise<void> => {
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  event.preventDefault();
  const presenterRef = useRef<NavigateToUserPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new NavigateToUserPresenter({ setDisplayedUser, displayErrorMessage });
  }

  const toUser = await presenterRef.current!.canNavigateToUser(event.target.toString(), authToken!, displayedUser!);
  if(toUser) navigate(`${featurePath}/${toUser}`);
}