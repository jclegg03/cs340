import { Status } from "tweeter-shared";
import { StatusService } from "../../../model.service/StatusService";
import { ItemPresenter } from "../ItemPresenter";

export abstract class StatusItemPresenter extends ItemPresenter<Status, StatusService> {
    protected serviceFactory(): StatusService {
        return new StatusService();
    }
}