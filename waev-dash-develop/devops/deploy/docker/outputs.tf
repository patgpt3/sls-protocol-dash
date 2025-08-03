# ECR Output
output "ecr_repo_url" {
    value = aws_ecr_repository.worker.repository_url
}

# Docker Image Outputs
output "tags" {
    value = var.docker_build_tags
}