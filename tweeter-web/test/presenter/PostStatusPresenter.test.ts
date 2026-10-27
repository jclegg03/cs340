import { anyNumber, instance, mock, spy, verify } from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/postStatus/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";


describe("PostStatusPresenter tests", () => {
    let view: PostStatusView;
    let presenter: PostStatusPresenter;
    const authToken = new AuthToken("123", 0);
    const currentUser = new User("first", "last", "@first", "./image/here.png");
    

    beforeEach(() => {
        view = mock<PostStatusView>();
        const mockedView = instance(view);

        const presenterSpy = spy(new PostStatusPresenter(mockedView));
        presenter = instance(presenterSpy);
    });

    it("tells the view to display a posting status message.", async () => {
       const postPromise = presenter.submitPost("Blah", currentUser, authToken);

        verify(view.displayInfoMessage("Posting status...", 0)).once();
        await postPromise;
        verify(view.displayInfoMessage("Status posted!", 2000)).once();
    });
})