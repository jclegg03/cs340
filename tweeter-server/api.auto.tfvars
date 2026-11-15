// AI-assisted: see AI-ATTRIBUTION.md
lambda = {
    login = { handler = "login.handler" }
    logout = { handler = "logout.handler" }
    register = { handler = "register.handler" }
    getUser = { handler = "getUser.handler" }
    getFolloweeCount = { handler = "getFolloweeCount.handler" }
    getFollowerCount = { handler = "getFollowerCount.handler" }
    follow = { handler = "follow.handler" }
    unfollow = { handler = "unfollow.handler" }
}

allowed_origins = [
    "http://localhost:5173",
]

api_resource = {
    login = { pathPart = "login", httpMethod = "POST", lambda = "login" }
    logout = { pathPart = "logout", httpMethod = "POST", lambda = "logout" }
    register = { pathPart = "register", httpMethod = "POST", lambda = "register" }
    getUser = { pathPart = "getUser", httpMethod = "POST", lambda = "getUser" }
    getFolloweeCount = { pathPart = "getFolloweeCount", httpMethod = "POST", lambda = "getFolloweeCount" }
    getFollowerCount = { pathPart = "getFollowerCount", httpMethod = "POST", lambda = "getFollowerCount" }
    follow = { pathPart = "follow", httpMethod = "POST", lambda = "follow" }
    unfollow = { pathPart = "unfollow", httpMethod = "POST", lambda = "unfollow" }
}
