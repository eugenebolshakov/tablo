variable "access_key" {}
variable "secret_key" {}
variable "region" {}
variable "transport_api_app_id" {}
variable "transport_api_app_key" {}

provider "aws" {
  access_key = "${var.access_key}"
  secret_key = "${var.secret_key}"
  region     = "${var.region}"
}

resource "aws_api_gateway_rest_api" "default" {
  name        = "TransportAPI Proxy"
  description = "Proxy for TransportAPI that adds auth credentials to requests"
}

resource "aws_api_gateway_resource" "default" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  parent_id   = "${aws_api_gateway_rest_api.default.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "default" {
  rest_api_id   = "${aws_api_gateway_rest_api.default.id}"
  resource_id   = "${aws_api_gateway_resource.default.id}"
  http_method   = "ANY"
  authorization = "NONE"
	request_parameters = {
		"method.request.path.proxy" = true
	}
}

resource "aws_api_gateway_integration" "default" {
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  resource_id = "${aws_api_gateway_resource.default.id}"
  http_method = "${aws_api_gateway_method.default.http_method}"
  integration_http_method = "${aws_api_gateway_method.default.http_method}"
  type = "HTTP_PROXY"
  uri = "https://transportapi.com/{proxy}"
  timeout_milliseconds = "10000"
  request_parameters = {
    "integration.request.path.proxy" = "method.request.path.proxy"
    "integration.request.querystring.app_id" = "'${var.transport_api_app_id}'"
    "integration.request.querystring.app_key" = "'${var.transport_api_app_key}'"
  }
}

resource "aws_api_gateway_deployment" "default" {
  depends_on = ["aws_api_gateway_integration.default"]
  rest_api_id = "${aws_api_gateway_rest_api.default.id}"
  stage_name  = "default"

  # Force re-deployment if anything in this file changes: there is no standard
  # way to do this.
  # https://github.com/hashicorp/terraform/issues/6613
  # https://github.com/terraform-providers/terraform-provider-aws/issues/162
  stage_description = "${filesha1("${path.module}/main.tf")}"
}

resource "aws_api_gateway_account" "default" {
  cloudwatch_role_arn = "${aws_iam_role.cloudwatch.arn}"
}

resource "aws_iam_role" "cloudwatch" {
  name = "api_gateway_cloudwatch_global"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "apigateway.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "cloudwatch" {
  name = "default"
  role = "${aws_iam_role.cloudwatch.id}"

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:DescribeLogGroups",
                "logs:DescribeLogStreams",
                "logs:PutLogEvents",
                "logs:GetLogEvents",
                "logs:FilterLogEvents"
            ],
            "Resource": "*"
        }
    ]
}
EOF
}

output "api_url" {
  value = "${aws_api_gateway_deployment.default.invoke_url}"
}
