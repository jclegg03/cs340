import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "./userInfo/UserInfoHooks";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useMessageActions } from "./toaster/MessageHooks";

export const useNavigateToUser = (featurePath: string) => async (event: React.MouseEvent): Promise<void> => {
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();
  event.preventDefault();

  try {

    const alias = extractAlias(event.target.toString());

    const toUser = await getUser(authToken!, alias);

      if (toUser) {
        if (!toUser.equals(displayedUser!)) {
          setDisplayedUser(toUser);
          navigate(`${featurePath}/${toUser.alias}`);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
}

const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };