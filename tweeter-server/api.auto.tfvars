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
    login = {
        pathPart = "login"
        httpMethod = "POST"
        lambda = "login"
        description = "Signs a user in. Body: alias, password. Returns the user and a new auth token."
    }
    logout = {
        pathPart = "logout"
        httpMethod = "POST"
        lambda = "logout"
        description = "Signs a user out. Body: authToken. Ends the session for that token."
    }
    register = {
        pathPart = "register"
        httpMethod = "POST"
        lambda = "register"
        description = "Creates a new user and signs them in. Body: firstName, lastName, alias, password, userImageBase64 (profile image bytes as base64), imageFileExtension (e.g. \"png\"). Returns the new user and an auth token."
    }
    getUser = {
        pathPart = "getUser"
        httpMethod = "POST"
        lambda = "getUser"
        description = "Looks up a user by alias. Body: authToken, alias. Returns the user, or null when no user has that alias."
    }
    getFolloweeCount = {
        pathPart = "getFolloweeCount"
        httpMethod = "POST"
        lambda = "getFolloweeCount"
        description = "Returns how many users a user is following. Body: authToken, user. Returns count."
    }
    getFollowerCount = {
        pathPart = "getFollowerCount"
        httpMethod = "POST"
        lambda = "getFollowerCount"
        description = "Returns how many users follow a user. Body: authToken, user. Returns count."
    }
    follow = {
        pathPart = "follow"
        httpMethod = "POST"
        lambda = "follow"
        description = "Makes the signed-in user follow another user. Body: authToken, user (the user to follow). Returns that user's new followerCount and followeeCount."
    }
    unfollow = {
        pathPart = "unfollow"
        httpMethod = "POST"
        lambda = "unfollow"
        description = "Makes the signed-in user stop following another user. Body: authToken, user (the user to unfollow). Returns that user's new followerCount and followeeCount."
    }
    isFollower = {
        pathPart = "isFollower"
        httpMethod = "POST"
        lambda = "isFollower"
        description = "Checks whether one user follows another. Body: authToken, user, selectedUser. Returns isFollower, which is true when user follows selectedUser."
    }
    loadMoreFollowees = {
        pathPart = "loadMoreFollowees"
        httpMethod = "POST"
        lambda = "loadMoreFollowees"
        description = "Returns one page of the users a user is following. Body: authToken, userAlias, pageSize, lastItem (the last user on the previous page, or null for the first page). Returns items (users) and hasMore."
    }
    loadMoreFollowers = {
        pathPart = "loadMoreFollowers"
        httpMethod = "POST"
        lambda = "loadMoreFollowers"
        description = "Returns one page of the users who follow a user. Body: authToken, userAlias, pageSize, lastItem (the last user on the previous page, or null for the first page). Returns items (users) and hasMore."
    }
    loadMoreFeedItems = {
        pathPart = "loadMoreFeedItems"
        httpMethod = "POST"
        lambda = "loadMoreFeedItems"
        description = "Returns one page of a user's feed, the statuses posted by the users they follow. Body: authToken, userAlias, pageSize, lastItem (the last status on the previous page, or null for the first page). Returns items (statuses) and hasMore."
    }
    loadMoreStoryItems = {
        pathPart = "loadMoreStoryItems"
        httpMethod = "POST"
        lambda = "loadMoreStoryItems"
        description = "Returns one page of a user's story, the statuses they posted. Body: authToken, userAlias, pageSize, lastItem (the last status on the previous page, or null for the first page). Returns items (statuses) and hasMore."
    }
    postStatus = {
        pathPart = "postStatus"
        httpMethod = "POST"
        lambda = "postStatus"
        description = "Posts a new status for the signed-in user. Body: authToken, newStatus (post text, user, timestamp)."
    }
}
