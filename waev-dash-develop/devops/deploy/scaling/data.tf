data "aws_acm_certificate" "this" {
  domain      = "*.waev-staging.com"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
}

data "aws_ami" "amazon_linux_ecs" {
  most_recent = true

  owners = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn-ami-*-amazon-ecs-optimized"]
  }

  filter {
    name   = "owner-alias"
    values = ["amazon"]
  }
}

data "template_file" "user_data" {
  template = file("${path.module}/templates/user_data.sh")

  vars = {
    cluster_name = var.ecs_cluster_name
  }
}
