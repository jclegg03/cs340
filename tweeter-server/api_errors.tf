// AI-assisted: see AI-ATTRIBUTION.md

locals {
    # When a lambda throws, API Gateway matches the error's message against these
    # regexes to pick the status code. Start the message with the tag to choose one,
    # e.g. throw new Error("[Bad Request] alias is required").
    # A thrown error that matches none of these still comes back as a 200.
    error_status_patterns = {
        "400" = ".*\\[Bad Request\\].*"
        "500" = ".*\\[Server Error\\].*"
    }

    # One entry per (endpoint, error status), keyed like "login-400".
    api_error_responses = {
        for pair in setproduct(keys(var.api_resource), keys(local.error_status_patterns)) :
        "${pair[0]}-${pair[1]}" => {
            resource = pair[0]
            status_code = pair[1]
            selection_pattern = local.error_status_patterns[pair[1]]
        }
    }
}

resource "aws_api_gateway_method_response" "method_response_error" {
    for_each = local.api_error_responses
    http_method = aws_api_gateway_method.api_methods[each.value.resource].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.value.resource].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    status_code = each.value.status_code
    response_models = {"application/json" = "Error"}
    # Error responses need their own CORS header; enabling CORS only covers the 200.
    response_parameters = {
        "method.response.header.Access-Control-Allow-Origin" = true
        "method.response.header.Vary" = true
    }
}

resource "aws_api_gateway_integration_response" "integration_response_error" {
    for_each = local.api_error_responses
    depends_on = [aws_api_gateway_integration.api_integrations]
    http_method = aws_api_gateway_method.api_methods[each.value.resource].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.value.resource].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    status_code = aws_api_gateway_method_response.method_response_error[each.key].status_code
    selection_pattern = each.value.selection_pattern
    response_parameters = {
        "method.response.header.Vary" = "'Origin'"
    }
    # Sets the CORS origin header (without it the browser hides the response and
    # fetch only sees "Failed to fetch"), then sends back just the error message.
    # The lambda's stack trace is left out so it isn't exposed to the browser.
    # ClientCommunicator reads errorMessage from this body when resp.ok is false.
    response_templates = {
        "application/json" = "${local.cors_origin_template}{\"errorMessage\": $input.json('$.errorMessage')}"
    }
}
