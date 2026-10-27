import { Status } from "tweeter-shared";
import ItemScroller from "./ItemScroller";
import StatusItem from "../statusItem/StatusItem";
import { StatusItemPresenter } from "../../presenter/mainLayout/statusItem/StatusItemPresenter";
import { ItemView } from "../../presenter/mainLayout/ItemPresenter";

interface Props {
  featureUrl: string,
  presenterFactory: (listener: ItemView<Status>) => StatusItemPresenter
}

const StatusItemScroller = (props: Props) => {
  return (
    <ItemScroller<Status>
      featureUrl={props.featureUrl}
      presenterFactory={props.presenterFactory}
      itemComponentFactory={(item, featureUrl) => (
        <StatusItem item={item} featurePath={featureUrl} />
      )}
    />
  );
}

export default StatusItemScroller;
