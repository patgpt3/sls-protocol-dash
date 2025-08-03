variable "tags" {
  type        = map(string)
  description = "Default tags to add to resources"
  default     = {}
}

# VPC References
variable "vpc_id" {
    type = string
    description = "The VPC ID to use for associations"
}

# Launch Configuration Config
variable "ecs_lc_name" {
    type = string
    description = "The name of the launch configuration to use for ECS"
    default = "ecs-lc"
}

variable "ecs_instance_profile_name" {
    type = string
    description = "The instance profile name to use to launch in ECS"
}

variable "ecs_security_group_ids" {
    type = list(string)
    description = "The security group ids to use to launch in ECS"
}

variable "ecs_cluster_name" {
    type = string
    description = "The ecs cluster name to associate"
}

variable "ecs_lc_instance_type" {
    type = string
    description = "The EC2 instance type for the launch config to use in ECS"
    default = "t2.micro"
}

# Load Balancer Config
variable "ecs_lb_subnet_ids" {
    type = list(string)
    description = "The subnet ids to use for the ECS load balancer"
}

variable "ecs_lb_name" {
    type = string
    description = "The name of the load balancer to use for ECS"
    default = "ecs-lb"
}

# AutoScaling Config
variable "ecs_as_name" {
    type = string
    description = "The name of the autoscaler to use for ECS"
    default = "asg"
}

variable "ecs_as_desired_capacity" {
    type = number
    description = "The desired capacity for ECS to scale to"
    default = 2
}

variable "ecs_as_min_capacity" {
    type = number
    description = "The minimum capacity for ECS to scale to"
    default = 1
}

variable "ecs_as_max_capacity" {
    type = number
    description = "The max capacity for ECS to scale to"
    default = 10
}

variable "ecs_as_health_check_timeout" {
    type = number
    description = "The timeout to wait for before the health check fails in ECS"
    default = 300
}

variable "ecs_as_health_check_type" {
    type = string
    description = "The health check type for ECS"
    default = "EC2"
}

variable "container_port" {
  type        = number
  description = "The port of the application and container to map"
  default     = 3000
}
