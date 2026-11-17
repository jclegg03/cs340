// AI-assisted: see AI-ATTRIBUTION.md

locals {
    api_description = "Tweeter API. Every endpoint is a POST that takes a JSON body and returns a JSON body with success and message, plus the endpoint's own fields. Endpoints other than login and register need the authToken from login or register in the body. Errors return 400 (bad request) or 500 (server error) with an errorMessage."

    # Changes whenever any description changes, so a new documentation version is
    # published instead of the stage keeping the old snapshot.
    api_docs_hash = substr(sha1(jsonencode({
        api = local.api_description
        methods = { for key, route in var.api_resource : key => route.description }
    })), 0, 8)
}

# Description of the API as a whole.
resource "aws_api_gateway_documentation_part" "api" {
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    location {
        type = "API"
    }
    properties = jsonencode({ description = local.api_description })
}

# One description per method, taken from var.api_resource in api.auto.tfvars.
# Same as "Update Documentation" on each method in the API Gateway console.
resource "aws_api_gateway_documentation_part" "methods" {
    for_each = var.api_resource
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    location {
        type = "METHOD"
        method = each.value.httpMethod
        path = "/${each.value.pathPart}"
    }
    properties = jsonencode({ description = each.value.description })
    depends_on = [aws_api_gateway_method.api_methods]
}

# Publishes a snapshot of the parts above. Same as "Publish documentation" in the
# console; the dev stage points at it (api_deployment.tf), so exporting the dev
# stage's Swagger/OpenAPI file includes these descriptions.
resource "aws_api_gateway_documentation_version" "docs" {
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    version = "1.0-${local.api_docs_hash}"
    description = "Tweeter API documentation"

    # The snapshot is taken when the version is created, so all parts must be up to date first.
    depends_on = [
        aws_api_gateway_documentation_part.api,
        aws_api_gateway_documentation_part.methods,
    ]

    # A new version replaces the old one: create it and move the stage onto it
    # before the old one is deleted.
    lifecycle {
        create_before_destroy = true
    }
}
