import { when, instance, mock, spy, verify, capture, anything } from "@typestrong/ts-mockito";
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
        when(view.displayInfoMessage(anything(), anything())).thenReturn("123");
        const mockedView = instance(view);

        const presenterSpy = spy(new PostStatusPresenter(mockedView));
        presenter = instance(presenterSpy);

        service = mock<StatusService>();
        const mockService = instance(service)
        when(presenterSpy.statusService).thenReturn(mockService);
    });

    it("tells the view to display a posting status message.", async () => {
        presenter.submitPost("Blah", currentUser, authToken);

        verify(view.displayInfoMessage("Posting status...", 0)).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
        await presenter.submitPost("BLaH", currentUser, authToken);

        const [auth, status] = capture(service.postStatus).last();
        expect(auth).toEqual(authToken);
        expect(status).toEqual(new Status("BLaH", currentUser, status.timestamp));
    });

    it("tells the view to clear the info message that was displayed previously on success", async () => {
        await presenter.submitPost("BLaH", currentUser, authToken);

        verify(view.deleteMessage("123")).once();
    });

    it("tells the view to clear the post on success", () => {
        presenter.submitPost("BLaH", currentUser, authToken).then(() => verify(view.setPost("")).once());
    });

    it("tells the view to displayy a status posted message on success", () => {
        presenter.submitPost("BLaH", currentUser, authToken).then(() => verify(view.displayInfoMessage("Status posted!", 2000)));
    });

    
})