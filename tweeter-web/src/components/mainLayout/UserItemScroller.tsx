import { User } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import UserItem from "../userItem/UserItem";
import { UserItemPresenter } from "../../presenter/mainLayout/userItem/UserItemPresenter";
import { ItemView } from "../../presenter/mainLayout/ItemPresenter";

interface Props {
  featureUrl: string,
  presenterFactory: (listener: ItemView<User>) => UserItemPresenter
}

const UserItemScroller = (props: Props) => {
  return (
    <ItemScroller<User>
      featureUrl={props.featureUrl}
      presenterFactory={props.presenterFactory}
      itemComponentFactory={(item, featureUrl) => (
        <div className="row mb-3 mx-0 px-0 border rounded bg-white">
          <UserItem user={item} featurePath={featureUrl} />
        </div>
      )}
    />
  );
}

export default UserItemScroller;
