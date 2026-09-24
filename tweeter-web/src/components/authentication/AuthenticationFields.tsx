interface Props {
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void,
    setAlias: (value: React.SetStateAction<string>) => void,
    setPassword: (value: React.SetStateAction<string>) => void,
    passwordIsFormBottom: boolean
}

const AuthenticationFields = (props: Props) => {
    return (
        <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={props.onKeyDown}
            onChange={(event) => props.setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className={`form-floating ${props.passwordIsFormBottom ? "mb-3" : ""}`}>
          <input
            type="password"
            className={`form-control ${props.passwordIsFormBottom ? "bottom" : ""}`}
            id="passwordInput"
            placeholder="Password"
            onKeyDown={props.onKeyDown}
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
        </>
    )
}

export default AuthenticationFields;