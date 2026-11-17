// AI-assisted: see AI-ATTRIBUTION.md

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
