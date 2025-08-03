resource "aws_iam_role" "ecs_agent" {
  name               = var.iam_role_name
  assume_role_policy = data.aws_iam_policy_document.ecs_agent.json

  path = "/"

  inline_policy {
    name = "ecs_policy"

    policy = jsonencode({
      Statement = [
        {
          Action   = ["ecs:CreateCluster", "ecs:DeregisterContainerInstance", "ecs:DiscoverPollEndpoint", "ecs:Poll", "ecs:RegisterContainerInstance", "ecs:StartTelemetrySession", "ecs:Submit*", "logs:CreateLogStream", "logs:PutLogEvents", "ecr:GetAuthorizationToken", "ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer", "cloudformation:SignalResource"]
          Effect   = "Allow"
          Resource = "*"
        },
      ]
    })
  }
}

resource "aws_iam_role_policy_attachment" "ecs_agent" {
  role       = aws_iam_role.ecs_agent.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_agent" {
  name = var.iam_role_name
  role = aws_iam_role.ecs_agent.name
}
