// AI-assisted: see AI-ATTRIBUTION.md
variable "lambda" {
    # key: short lambda name (deployed as "tweeter-<key>")
    # handler: "<file in dist>.<exported function>", e.g. "login.handler"
    type= map(object({handler = string}))
    default = {}
}

variable "api_resource" {
    # pathPart: URL path segment, e.g. "login" -> /dev/login
    # httpMethod: e.g. "POST"
    # lambda: key of the lambda (from var.lambda) that handles this endpoint
    type= map(object({pathPart = string, httpMethod = string, lambda = string}))
    default = {}
}
