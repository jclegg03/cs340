import { Link, useNavigate } from "react-router-dom";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import Post from "./Post";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { useContext } from "react";
import { ToastType } from "../toaster/Toast";
import { UserInfoActionsContext, UserInfoContext } from "../userInfo/UserInfoContexts";

interface Props {
    index: number,
    item: Status,
    featurePath: string
}
const StatusItem = (props: Props) => {
    const { displayToast } = useContext(ToastActionsContext);
    const { setDisplayedUser } = useContext(UserInfoActionsContext);
    const { displayedUser, authToken } = useContext(UserInfoContext);
    const navigate = useNavigate();

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();
    
        try {
          const alias = extractAlias(event.target.toString());
    
          const toUser = await getUser(authToken!, alias);
    
          if (toUser) {
            if (!toUser.equals(displayedUser!)) {
              setDisplayedUser(toUser);
              navigate(`${props.featurePath}/${toUser.alias}`);
            }
          }
        } catch (error) {
          displayToast(
            ToastType.Error,
            `Failed to get user because of exception: ${error}`,
            0
          );
        }
      };

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

    return (
        <div
            key={props.index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <div className="col bg-light mx-0 px-0">
              <div className="container px-0">
                <div className="row mx-0 px-0">
                  <div className="col-auto p-3">
                    <img
                      src={props.item.user.imageUrl}
                      className="img-fluid"
                      width="80"
                      alt="Posting user"
                    />
                  </div>
                  <div className="col">
                    <h2>
                      <b>
                        {props.item.user.firstName} {props.item.user.lastName}
                      </b>{" "}
                      -{" "}
                      <Link
                        to={`${props.featurePath}/${props.item.user.alias}`}
                        onClick={navigateToUser}
                      >
                        {props.item.user.alias}
                      </Link>
                    </h2>
                    {props.item.formattedDate}
                    <br />
                    <Post status={props.item} featurePath={props.featurePath} />
                  </div>
                </div>
              </div>
            </div>
          </div>
    )
}

export default StatusItem;