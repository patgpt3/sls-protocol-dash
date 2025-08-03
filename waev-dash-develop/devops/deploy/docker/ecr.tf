resource "aws_ecr_repository" "worker" {
  name                 = var.ecr_repo_name
  image_tag_mutability = "MUTABLE"
}

resource "null_resource" "push" {
  triggers = {
    docker_image = docker_image.build.latest
  }

  provisioner "local-exec" {
    command = "${path.module}/assets/push.sh"
    environment = {
      ACCOUNT_ID = "${data.aws_caller_identity.current.account_id}"
      REGION_ID = "${data.aws_region.current.name}"
      REPO_NAME = "${var.ecr_repo_name}"
      REPO_TAG = "${var.ecr_repo_tag}"
     }
  }
}
