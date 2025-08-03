resource "docker_image" "build" {
  name = local.repo_path
  build {
    dockerfile = "Dockerfile.prod"
    path       = var.docker_build_dir
    tag        = formatlist("${local.repo_path}:%s", var.docker_build_tags)
    build_arg  = merge(var.docker_build_args, { "environment" : terraform.workspace })
    label      = var.docker_build_labels
  }

  depends_on = [
    aws_ecr_repository.worker
  ]
}
