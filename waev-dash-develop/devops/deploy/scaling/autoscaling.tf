resource "aws_autoscaling_group" "ecs_asg" {
  name                = var.ecs_as_name
  vpc_zone_identifier = var.ecs_lb_subnet_ids

  launch_configuration = aws_launch_configuration.ecs_launch_config.name

  desired_capacity          = var.ecs_as_desired_capacity
  min_size                  = var.ecs_as_min_capacity
  max_size                  = var.ecs_as_max_capacity
  health_check_grace_period = var.ecs_as_health_check_timeout
  health_check_type         = var.ecs_as_health_check_type

  # tags = [{
  #   key                 = "DEPLOY_TS"
  #   value               = "${timestamp()}"
  #   propagate_at_launch = true
  # }]

  # instance_refresh {
  #   strategy = "Rolling"
  #   triggers = ["tags", "tag"]
  # }

  lifecycle {
    create_before_destroy = true
  }
}
