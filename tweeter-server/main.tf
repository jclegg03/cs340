// AI-assisted: see AI-ATTRIBUTION.md
terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "~> 5.80"
        }
        archive = {
            source = "hashicorp/archive"
            version = "~> 2.4"
        }
    }
}

provider "aws" {
    region = "us-west-2"
    profile = "personal"
}

# ---------- Lambda ----------

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
    name = "tweeter-lambda-role"
    assume_role_policy = data.aws_iam_policy_document.lambda_role_trust.json
}

# Lets the lambdas write logs to CloudWatch so console.log output is visible.
resource "aws_iam_role_policy_attachment" "lambda_logs" {
    role = aws_iam_role.lambda_role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Zips the compiled TypeScript output. Run `npm run build` before `terraform apply`.
data "archive_file" "lambda_zip" {
    type = "zip"
    source_dir = "${path.module}/dist"
    output_path = "${path.module}/lambda.zip"
    excludes = ["*.map", "*.d.ts"]
}

resource "aws_lambda_function" "api_lambdas" {
    for_each = var.lambda
    function_name = "tweeter-${each.key}"
    role = aws_iam_role.lambda_role.arn
    filename = data.archive_file.lambda_zip.output_path
    source_code_hash = data.archive_file.lambda_zip.output_base64sha256
    runtime = "nodejs22.x"
    handler = each.value.handler
    timeout = 10
}

# ---------- API Gateway ----------

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
}

resource "aws_api_gateway_integration_response" "integration_response_200" {
    for_each = var.api_resource
    # The integration must exist before its response can be created.
    depends_on = [aws_api_gateway_integration.api_integrations]
    http_method = aws_api_gateway_method.api_methods[each.key].http_method
    resource_id = aws_api_gateway_resource.api_resources[each.key].id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    status_code = aws_api_gateway_method_response.method_response_200[each.key].status_code
}

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
        ]))
    }

    lifecycle {
        create_before_destroy = true
    }

    depends_on = [
        aws_api_gateway_integration.api_integrations,
        aws_api_gateway_method_response.method_response_200,
        aws_api_gateway_integration_response.integration_response_200
    ]
}

resource "aws_api_gateway_stage" "dev" {
    deployment_id = aws_api_gateway_deployment.deployment.id
    rest_api_id = aws_api_gateway_rest_api.tweeter_api.id
    stage_name = "dev"
}

resource "aws_lambda_permission" "permission" {
    for_each = var.lambda
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.api_lambdas[each.key].function_name
    principal = "apigateway.amazonaws.com"
    source_arn = "${aws_api_gateway_rest_api.tweeter_api.execution_arn}/*"
}

output "api_base_url" {
    value = aws_api_gateway_stage.dev.invoke_url
}
