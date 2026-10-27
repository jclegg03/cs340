import { MemoryRouter } from "react-router-dom";
import { PostStatusPresenter } from "../../src/presenter/postStatus/PostStatusPresenter";
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import PostStatus from "../../src/components/postStatus/PostStatus";
import { render, screen } from "@testing-library/react";
import { AuthToken, User } from "tweeter-shared";
import { instance, mock, verify } from "@typestrong/ts-mockito";

const currentUser = new User("first", "last", "@alias", "./path/to/image.png")
const authToken = new AuthToken("123", 0);

jest.mock("../../src/components/userInfo/UserInfoHooks", () => ({
    ...jest.requireActual("../../src/components/userInfo/UserInfoHooks"),
    __esModule: true,
    useUserInfo: jest.fn(() => {
        return { currentUser, authToken }
    }),
}));

describe("Post Status tests", () => {

    beforeEach(() => {

    });
    it("When first rendered the Post Status and Clear buttons are both disabled.", () => {
        const { postStatusButton, clearButton } = renderPostStatusAndReturnComponents();

        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("Both buttons are enabled when the text field has text.", async () => {
        const { user, postStatusButton, clearButton, postTextArea } = renderPostStatusAndReturnComponents();

        await user.type(postTextArea, "blah");

        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it("Both buttons are disabled when the text field is cleared.", async () => {
        const { user, postStatusButton, clearButton, postTextArea } = renderPostStatusAndReturnComponents();

        await user.type(postTextArea, "blah");
        await user.clear(postTextArea);

        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed.", async () => {
        const presenter = mock<PostStatusPresenter>();
        const mockedPresenter = instance(presenter);

        const { user, postStatusButton, postTextArea } = renderPostStatusAndReturnComponents(mockedPresenter);
        await user.type(postTextArea, "blah");
        await user.click(postStatusButton);
        verify(presenter.submitPost("blah", currentUser, authToken)).once();
    });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
    return render(
        <MemoryRouter>
            <PostStatus presenter={presenter} />
        </MemoryRouter>
    );
}

function renderPostStatusAndReturnComponents(presenter?: PostStatusPresenter) {
    const user = userEvent.setup();

    renderPostStatus(presenter);

    const postStatusButton = screen.getByLabelText("Post Status");
    const clearButton = screen.getByLabelText("Clear");
    const postTextArea = screen.getByLabelText("post text");

    return { user, postStatusButton, clearButton, postTextArea }
}