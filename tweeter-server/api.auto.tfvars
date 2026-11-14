// AI-assisted: see AI-ATTRIBUTION.md
lambda = {
    login = { handler = "login.handler" }
    logout = { handler = "logout.handler" }
}

allowed_origins = [
    "http://localhost:5173",
]

api_resource = {
    login = { pathPart = "login", httpMethod = "POST", lambda = "login" }
    logout = { pathPart = "logout", httpMethod = "POST", lambda = "logout" }
}
