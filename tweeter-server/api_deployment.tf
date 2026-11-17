// AI-assisted: see AI-ATTRIBUTION.md

resource "aws_api_gateway_deployment" "deployment" {
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id

    # Redeploy whenever the API's shape changes.
    triggers = {
        redeployment = sha1(jsonencode([
            aws_api_gateway_resource.api_resources,
            aws_api_gateway_method.api_methods,
            aws_api_gateway_integration.api_integrations,
            aws_api_gateway_method_response.method_response_200,
            aws_api_gateway_integration_response.integration_response_200,
            aws_api_gateway_method_response.method_response_error,
            aws_api_gateway_integration_response.integration_response_error,
            aws_api_gateway_method.cors_options,
            aws_api_gateway_integration.cors_options,
            aws_api_gateway_method_response.cors_options_200,
            aws_api_gateway_integration_response.cors_options_200,
        ]))
    }

    lifecycle {
        create_before_destroy = true
    }

    depends_on = [
        aws_api_gateway_integration.api_integrations,
        aws_api_gateway_method_response.method_response_200,
        aws_api_gateway_integration_response.integration_response_200,
        aws_api_gateway_integration_response.integration_response_error,
        aws_api_gateway_integration_response.cors_options_200
    ]
}

resource "aws_api_gateway_stage" "dev" {
    deployment_id = aws_api_gateway_deployment.deployment.id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    stage_name = "dev"
}
