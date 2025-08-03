resource "aws_launch_configuration" "ecs_launch_config" {
  # name = var.ecs_lc_name

  image_id                    = data.aws_ami.amazon_linux_ecs.id
  iam_instance_profile        = var.ecs_instance_profile_name
  security_groups             = var.ecs_security_group_ids
  user_data                   = data.template_file.user_data.rendered
  instance_type               = var.ecs_lc_instance_type
  associate_public_ip_address = true

  lifecycle {
    create_before_destroy = true
  }
}
