# VPC References
variable "vpc_id" {
    type = string
    description = "The VPC ID to use for associations"
}

# Security Configuration
variable "ecs_sg_name" {
    type = string
    description = "The name of the ECS security group"
    default = "ecs-sg"
}

# IAM Configuration
variable "iam_role_name" {
    type = string
    description = "The role name to use in the created IAM ECS role"
    default = "ecs-agent"
}
