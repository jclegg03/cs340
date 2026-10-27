import { render, screen } from "@testing-library/react";
import Login from "../../src/components/authentication/login/Login"
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../src/presenter/authentication/LoginPresenter";
import { instance, mock, verify } from "@typestrong/ts-mockito";


describe("Login Component", () => {
    library.add(fab);
    const enableButton = async (alias = "blah", password = "pw", originalURL?: string, presenter?: LoginPresenter) => {
        const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement(originalURL, presenter);
        await user.type(aliasField, alias);
        await user.type(passwordField, password);

        expect(signInButton).toBeEnabled();
        return { signInButton, aliasField, passwordField, user }
    }

    it("When first rendered the sign-in button is disabled.", () => {
        const { signInButton } = renderLoginAndGetElement("");
        expect(signInButton).toBeDisabled();
    });

    it("The sign-in button is enabled when both the alias and password fields have text.", async () => {
        await enableButton();
    });

    it("The sign-in button is disabled if either the alias or password field is cleared.", async () => {
        const { signInButton, aliasField, passwordField, user } = await enableButton();

        await user.clear(aliasField)
        expect(signInButton).toBeDisabled();
        await user.type(aliasField, "e");

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();
    });

    it("The presenter's login method is called with correct parameters when the sign-in button is pressed.", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const originalUrl = "/blah"
        const alias = "@blah"
        const password = "blah"
        const { signInButton, user } = await enableButton(alias, password, originalUrl, mockPresenterInstance);
        await user.click(signInButton);
        verify(mockPresenter.login(alias, password, originalUrl)).once();
    });
});

function renderLogin(originalUrl?: string, presenter?: LoginPresenter) {
    return render(
        <MemoryRouter>
            <Login originalUrl={originalUrl} presenter={presenter} />
        </MemoryRouter>
    );
}

function renderLoginAndGetElement(originalUrl?: string, presenter?: LoginPresenter) {
    const user = userEvent.setup();

    renderLogin(originalUrl, presenter);

    const signInButton = screen.getByRole("button", { name: /Sign in/i });
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return { user, signInButton, aliasField, passwordField }
}