// AI-assisted: see AI-ATTRIBUTION.md
variable "lambda" {
    # key: short lambda name (deployed as "tweeter-<key>")
    # handler: "<file path in dist, without .js>.<exported function>", e.g. "handlers/login.handler"
    type= map(object({handler = string}))
    default = {}
}

variable "api_resource" {
    # pathPart: URL path segment, e.g. "login" -> /dev/login
    # httpMethod: e.g. "POST"
    # lambda: key of the lambda (from var.lambda) that handles this endpoint
    # description: what the endpoint does, published as API Gateway documentation
    type= map(object({pathPart = string, httpMethod = string, lambda = string, description = string}))
    default = {}
}

variable "allowed_origins" {
    # Browser origins allowed to call the API (scheme + host + port, no trailing slash).
    type = list(string)
    default = ["http://localhost:5173"]
}
