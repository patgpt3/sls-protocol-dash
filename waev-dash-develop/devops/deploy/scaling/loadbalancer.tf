resource "aws_lb" "worker" {
  name            = var.ecs_lb_name
  subnets         = var.ecs_lb_subnet_ids
  security_groups = var.ecs_security_group_ids
}

resource "aws_lb_target_group" "worker" {
  name        = "${var.ecs_lb_name}-tg"
  port        = var.container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  stickiness {
    enabled = true
    type    = "lb_cookie"
  }

  health_check {
    path                = "/"
    port                = var.container_port
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 120
    interval            = 300
    matcher             = "200" # has to be HTTP 200 or fails
  }
}

resource "aws_lb_listener" "worker-insecure" {
  load_balancer_arn = aws_lb.worker.id
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "worker-secure" {
  load_balancer_arn = aws_lb.worker.id
  port              = "443"
  protocol          = "HTTPS"

  ssl_policy      = "ELBSecurityPolicy-2016-08"
  certificate_arn = data.aws_acm_certificate.this.arn

  default_action {
    target_group_arn = aws_lb_target_group.worker.arn
    type             = "forward"
  }
}
