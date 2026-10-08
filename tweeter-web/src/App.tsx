import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { useUserInfo } from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/mainLayout/userItem/FolloweePresenter";
import { FollowerPresenter } from "./presenter/mainLayout/userItem/FollowerPresenter";
import { UserItemView } from "./presenter/mainLayout/userItem/UserItemPresenter";
import { FeedPresenter } from "./presenter/mainLayout/statusItem/FeedPresenter";
import { StatusItemView } from "./presenter/mainLayout/statusItem/StatusItemPresenter";
import { StoryPresenter } from "./presenter/mainLayout/statusItem/StoryPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route path="feed/:displayedUser" element={
          <StatusItemScroller
            key={`feed-${displayedUser!.alias}`}
            featureUrl="/feed"
            presenterFactory={(listener: StatusItemView) => new FeedPresenter(listener)}
          />
        } />
        <Route path="story/:displayedUser" element={
          <StatusItemScroller
            key={`story-${displayedUser!.alias}`}
            featureUrl="/story"
            presenterFactory={(listener: StatusItemView) => new StoryPresenter(listener)}
          />
        } />
        <Route
          path="followees/:displayedUser"
          element={
            <UserItemScroller
              key={`folowees-${displayedUser!.alias}`}
              featureUrl="/followees"
              presenterFactory={(listener: UserItemView) => new FolloweePresenter(listener)}
            />
          } />
        <Route
          path="followers/:displayedUser"
          element={
            <UserItemScroller
              key={`folowers-${displayedUser!.alias}`}
              featureUrl="/followers"
              presenterFactory={(listener: UserItemView) => new FollowerPresenter(listener)}
            />
          } />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
