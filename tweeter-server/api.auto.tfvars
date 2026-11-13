// AI-assisted: see AI-ATTRIBUTION.md
lambda = {
    login = { handler = "login.handler" }
}

api_resource = {
    login = { pathPart = "login", httpMethod = "POST", lambda = "login" }
}
