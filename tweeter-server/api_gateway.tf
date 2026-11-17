// AI-assisted: see AI-ATTRIBUTION.md

resource "aws_api_gateway_rest_api" "tweeter_api" {
    name = "TweeterAPI"
    endpoint_configuration {
        types = ["REGIONAL"]
    }
}

resource "aws_api_gateway_resource" "api_resources" {
    for_each = var.api_resource
    parent_id = aws_api_gateway_rest_api.tweeter_api.root_resource_id
    path_part = each.value.pathPart
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
}

resource "aws_api_gateway_method" "api_methods" {
    for_each = var.api_resource
    authorization = "NONE"
    http_method = each.value.httpMethod
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
}

# Non-proxy integration: the JSON request body is passed to the lambda as its
# event, and the lambda's return value is sent back as the response body.
resource "aws_api_gateway_integration" "api_integrations" {
    for_each = var.api_resource
    http_method = aws_api_gateway_method.api_methods[each.key].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    type = "AWS"
    integration_http_method = "POST"
    content_handling = "CONVERT_TO_TEXT"
    uri = aws_lambda_function.api_lambdas[each.value.lambda].invoke_arn
}

resource "aws_api_gateway_method_response" "method_response_200" {
    for_each = var.api_resource
    http_method = aws_api_gateway_method.api_methods[each.key].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    status_code = "200"
    response_models = {"application/json" = "Empty"}
    response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = true
        "method.response.header.Vary" = true
    }
}

resource "aws_api_gateway_integration_response" "integration_response_200" {
    for_each = var.api_resource
    # The integration must exist before its response can be created.
    depends_on = [aws_api_gateway_integration.api_integrations]
    http_method = aws_api_gateway_method.api_methods[each.key].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    status_code = aws_api_gateway_method_response.method_response_200[each.key].status_code
    response_parameters = {
        "method.response.header.Vary" = "'Origin'"
    }
    # Sets the CORS origin header, then passes the lambda's result through as the body.
    response_templates = {
        "application/json" = "${local.cors_origin_template}$input.json('$')"
    }
}

resource "aws_lambda_permission" "permission" {
    for_each = var.lambda
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.api_lambdas[each.key].function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_api_gateway_rest_api.tweeter_api.execution_arn}/*"
}
