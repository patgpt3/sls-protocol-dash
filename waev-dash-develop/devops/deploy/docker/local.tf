locals {
  repo_path = replace(aws_ecr_repository.worker.repository_url, "https://", "")
}
