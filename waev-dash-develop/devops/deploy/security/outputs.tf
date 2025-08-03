# Security Group Output
output "ecs_sg_id" {
    value = aws_security_group.ecs_sg.id
}

# IAM Output
output "iam_instance_profile_name" {
    value = aws_iam_instance_profile.ecs_agent.name
}
