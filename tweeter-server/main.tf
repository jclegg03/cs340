terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "5.4.0"
        }
    }
}

provider "aws" {
    region = "us-west-2"
    profile = "personal"
}

data "aws_iam_policy_document" "lambda_role_trust" {
    statement {
        effect = "Allow"

        principals {
            identifiers = ["lambda.amazonaws.com"]
            type = "Service"
        }

        actions = ["sts:AssumeRole"]
    }
}

resource "aws_iam_role" "lambda_role" {
    assume_role_policy = data.aws_iam_policy_document.lambda_role_trust.json
}

resource "aws_lambda_function" "api_lambdas" {
    for_each = var.lambda
    function_name = each.key
    role = aws_iam_role.lambda_role.arn
    filename = each.filename
    runtime = 
    handler = 
    source_code_hash = filebase64sha256("./target/HelloLambdaWorld-1.0-SNAPSHOT.jar")
}

resource "aws_api_gateway_rest_api" "HelloWorldAPI" {
    name = "AssignmentAPIGateway"
    endpoint_configuration {
        types = ["REGIONAL"]
    }
}

resource "aws_api_gateway_resource" "HelloWorld" {
    parent_id = aws_api_gateway_rest_api.HelloWorldAPI.root_resource_id
    path_part = "HelloWorld"
    rest_api_id = aws_api_gateway_rest_api.HelloWorldAPI.id
}

resource "aws_api_gateway_method" "HelloWorldMethod" {
    authorization = "NONE"
    http_method = "ANY"
    resource_id = aws_api_gateway_resource.HelloWorld.id
    rest_api_id = aws_api_gateway_rest_api.HelloWorldAPI.id
}

resource "aws_api_gateway_integration" "HelloWorldIntegration" {
    http_method = aws_api_gateway_method.HelloWorldMethod.http_method
    resource_id = aws_api_gateway_resource.HelloWorld.id
    rest_api_id = aws_api_gateway_rest_api.HelloWorldAPI.id
    type = "AWS"
    integration_http_method = "POST"
    content_handling = "CONVERT_TO_TEXT"
    uri = aws_lambda_function.part_one_lambda.invoke_arn
}

resource "aws_api_gateway_method_response" "method_response_200" {
    http_method = aws_api_gateway_method.HelloWorldMethod.http_method
    resource_id = aws_api_gateway_resource.HelloWorld.id
    rest_api_id = aws_api_gateway_rest_api.HelloWorldAPI.id
    status_code = "200"
    response_models = {"application/json" = "Empty"}
}

resource "time_sleep" "wait_30_seconds" {

  create_duration = "30s"

}

resource "aws_api_gateway_integration_response" "integration_response_200" {
    depends_on = [time_sleep.wait_30_seconds]
    http_method = aws_api_gateway_method.HelloWorldMethod.http_method
    resource_id = aws_api_gateway_resource.HelloWorld.id
    rest_api_id = aws_api_gateway_rest_api.HelloWorldAPI.id
    status_code = "200"
}

resource "aws_api_gateway_deployment" "deployment" {
    rest_api_id = aws_api_gateway_rest_api.HelloWorldAPI.id
    stage_name = "dev"
    depends_on = [
        aws_api_gateway_integration.HelloWorldIntegration, 
        aws_api_gateway_method_response.method_response_200, 
        aws_api_gateway_integration_response.integration_response_200
    ]
}

resource "aws_lambda_permission" "permission" {
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.part_one_lambda.function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_api_gateway_rest_api.HelloWorldAPI.execution_arn}/*"
}