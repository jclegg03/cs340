// AI-assisted: see AI-ATTRIBUTION.md

locals {
    # VTL that echoes the caller's Origin back only when it is in var.allowed_origins.
    # API Gateway can't list several origins in one header, so it has to pick per request.
    cors_origin_template = <<-EOT
        #set($origin = $input.params("Origin"))
        #if($origin == "")#set($origin = $input.params("origin"))#end
        #set($allowedOrigins = ${jsonencode(var.allowed_origins)})
        #if($allowedOrigins.contains($origin))
        #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)
        #end
    EOT
}

# Browsers send an OPTIONS "preflight" request before a JSON POST.
# These answer it directly from API Gateway without calling a lambda.
resource "aws_api_gateway_method" "cors_options" {
    for_each = var.api_resource
    authorization = "NONE"
    http_method = "OPTIONS"
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
}

resource "aws_api_gateway_integration" "cors_options" {
    for_each = var.api_resource
    http_method = aws_api_gateway_method.cors_options[each.key].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    type = "MOCK"
    request_templates = {
        "application/json" = "{\"statusCode\": 200}"
    }
}

resource "aws_api_gateway_method_response" "cors_options_200" {
    for_each = var.api_resource
    http_method = aws_api_gateway_method.cors_options[each.key].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    status_code = "200"
    response_models = {"application/json" = "Empty"}
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = true
        "method.response.header.Access-Control-Allow-Methods" = true
        "method.response.header.Access-Control-Allow-Origin" = true
        "method.response.header.Vary" = true
    }
}

resource "aws_api_gateway_integration_response" "cors_options_200" {
    for_each = var.api_resource
    depends_on = [aws_api_gateway_integration.cors_options]
    http_method = aws_api_gateway_method.cors_options[each.key].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    status_code = aws_api_gateway_method_response.cors_options_200[each.key].status_code
    response_parameters = {
        "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'"
        "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,${each.value.httpMethod}'"
        "method.response.header.Vary" = "'Origin'"
    }
    response_templates = {
        "application/json" = local.cors_origin_template
    }
}
