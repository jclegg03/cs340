import { Link } from "react-router-dom";
import { Status } from "tweeter-shared";
import Post from "./Post";
import { useNavigateToUser } from "../UseNavigateToUser";

interface Props {
    index: number,
    item: Status,
    featurePath: string
}
const StatusItem = (props: Props) => {
    const navigateToUser = useNavigateToUser(props.featurePath);

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