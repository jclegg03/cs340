import { Fragment, ReactNode, useState, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { ItemPresenter, ItemView } from "../../presenter/mainLayout/ItemPresenter";
import { Service } from "../../model.service/Service";

interface Props<T> {
  featureUrl: string,
  presenterFactory: (listener: ItemView<T>) => ItemPresenter<T, Service>,
  itemComponentFactory: (item: T, featureUrl: string) => ReactNode
}

const ItemScroller = <T,>(props: Props<T>) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);
  const presenterRef = useRef<ItemPresenter<T, Service> | null>(null);

  const addItems = (newItems: T[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);
  if (!presenterRef.current) {
    presenterRef.current = props.presenterFactory({ displayErrorMessage, addItems });
  }

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenterRef.current!.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems();
  }, [displayedUser]);

  const reset = () => {
    setItems(() => []);
    presenterRef.current!.reset();
  };

  const loadMoreItems = async () => {
    presenterRef.current!.loadMoreItems(authToken!, displayedUser!.alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems()}
        hasMore={presenterRef.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <Fragment key={index}>
            {props.itemComponentFactory(item, props.featureUrl)}
          </Fragment>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default ItemScroller;
