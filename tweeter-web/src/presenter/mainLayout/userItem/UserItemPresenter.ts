import { User } from "tweeter-shared"
import { ItemPresenter } from "../ItemPresenter";
import { FollowService } from "../../../model.service/FollowService";

export abstract class UserItemPresenter extends ItemPresenter<User, FollowService> {
    protected serviceFactory(): FollowService {
        return new FollowService();
    }
}