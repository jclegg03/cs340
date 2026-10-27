import { when, instance, mock, spy, verify, capture } from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/postStatus/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";


describe("PostStatusPresenter tests", () => {
    let view: PostStatusView;
    let presenter: PostStatusPresenter;
    let service: StatusService;
    const authToken = new AuthToken("123", 0);
    const currentUser = new User("first", "last", "@first", "./image/here.png");


    beforeEach(() => {
        view = mock<PostStatusView>();
        const mockedView = instance(view);

        const presenterSpy = spy(new PostStatusPresenter(mockedView));
        presenter = instance(presenterSpy);

        service = mock<StatusService>();
        const mockService = instance(service)
        when(presenterSpy.statusService).thenReturn(mockService);
    });

    it("tells the view to display a posting status message.", async () => {
       const postPromise = presenter.submitPost("Blah", currentUser, authToken);

        verify(view.displayInfoMessage("Posting status...", 0)).once();
        await postPromise;
        verify(view.displayInfoMessage("Status posted!", 2000)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
        await presenter.submitPost("BLaH", currentUser, authToken);

        const [auth, status] = capture(service.postStatus).last();
        expect(auth).toEqual(authToken);
        expect(status).toEqual(new Status("BLaH", currentUser, status.timestamp));
    });
})