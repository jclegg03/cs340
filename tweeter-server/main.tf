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

# Holds lambda.zip so it is uploaded once per apply. Every function then points
# at this one object instead of each uploading its own copy of the zip.
# bucket_prefix lets AWS add a random suffix, since bucket names are global.
resource "aws_s3_bucket" "lambda_code" {
    bucket_prefix = "tweeter-lambda-code-"
    # Lets `terraform destroy` remove the bucket even though it holds the zip.
    force_destroy = true
}

resource "aws_s3_bucket_public_access_block" "lambda_code" {
    bucket = aws_s3_bucket.lambda_code.id
    block_public_acls = true
    block_public_policy = true
    ignore_public_acls = true
    restrict_public_buckets = true
}

# Re-uploaded only when the zip's contents change.
resource "aws_s3_object" "lambda_zip" {
    bucket = aws_s3_bucket.lambda_code.id
    key = "lambda.zip"
    source = data.archive_file.lambda_zip.output_path
    source_hash = data.archive_file.lambda_zip.output_base64sha256
}

# Zips the layer folder (tweeter-shared + runtime npm deps) built by `npm run build`.
# Lambda extracts it to /opt, so modules land in /opt/nodejs/node_modules, which
# Node searches automatically.
data "archive_file" "shared_layer_zip" {
    type = "zip"
    source_dir = "${path.module}/layer"
    output_path = "${path.module}/layer.zip"
    excludes = ["**/*.map"]
}

resource "aws_lambda_layer_version" "tweeter_shared_layer" {
    layer_name = "tweeter-shared"
    filename = data.archive_file.shared_layer_zip.output_path
    source_code_hash = data.archive_file.shared_layer_zip.output_base64sha256
    compatible_runtimes = ["nodejs22.x"]
}

resource "aws_lambda_function" "api_lambdas" {
    for_each = var.lambda
    function_name = "tweeter-${each.key}"
    role = aws_iam_role.lambda_role.arn
    # Code comes from the single S3 copy of lambda.zip. source_code_hash still
    # tells Terraform when the code changed and the function needs updating.
    s3_bucket = aws_s3_object.lambda_zip.bucket
    s3_key = aws_s3_object.lambda_zip.key
    source_code_hash = data.archive_file.lambda_zip.output_base64sha256
    runtime = "nodejs22.x"
    handler = each.value.handler
    timeout = 10
    # Provides tweeter-shared at runtime. Referencing the layer's ARN also makes
    # each lambda depend on it, so a changed layer is published first and the
    # lambdas are updated to the new version.
    layers = [aws_lambda_layer_version.tweeter_shared_layer.arn]
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

# ---------- CORS ----------

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
        aws_api_gateway_integration_response.cors_options_200
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
