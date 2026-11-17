// AI-assisted: see AI-ATTRIBUTION.md
lambda = {
    login = { handler = "handlers/login.handler" }
    logout = { handler = "handlers/logout.handler" }
    register = { handler = "handlers/register.handler" }
    getUser = { handler = "handlers/getUser.handler" }
    getFolloweeCount = { handler = "handlers/getFolloweeCount.handler" }
    getFollowerCount = { handler = "handlers/getFollowerCount.handler" }
    follow = { handler = "handlers/follow.handler" }
    unfollow = { handler = "handlers/unfollow.handler" }
    isFollower = { handler = "handlers/isFollower.handler" }
    loadMoreFollowees = { handler = "handlers/loadMoreFollowees.handler" }
    loadMoreFollowers = { handler = "handlers/loadMoreFollowers.handler" }
    loadMoreFeedItems = { handler = "handlers/loadMoreFeedItems.handler" }
    loadMoreStoryItems = { handler = "handlers/loadMoreStoryItems.handler" }
    postStatus = { handler = "handlers/postStatus.handler" }
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
    isFollower = { pathPart = "isFollower", httpMethod = "POST", lambda = "isFollower" }
    loadMoreFollowees = { pathPart = "loadMoreFollowees", httpMethod = "POST", lambda = "loadMoreFollowees" }
    loadMoreFollowers = { pathPart = "loadMoreFollowers", httpMethod = "POST", lambda = "loadMoreFollowers" }
    loadMoreFeedItems = { pathPart = "loadMoreFeedItems", httpMethod = "POST", lambda = "loadMoreFeedItems" }
    loadMoreStoryItems = { pathPart = "loadMoreStoryItems", httpMethod = "POST", lambda = "loadMoreStoryItems" }
    postStatus = { pathPart = "postStatus", httpMethod = "POST", lambda = "postStatus" }
}
