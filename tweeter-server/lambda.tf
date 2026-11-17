// AI-assisted: see AI-ATTRIBUTION.md

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
