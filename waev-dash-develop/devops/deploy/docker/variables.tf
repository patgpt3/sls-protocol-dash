# ECR Config
variable "ecr_repo_name" {
    type = string
    description = "The name of the ECR repo"
}

variable "ecr_repo_tag" {
    type = string
    description = "The tag of the ECR repo image to use"
}

# Docker Config
variable "docker_build_dir" {
  type        = string
  description = "The build directory for docker"
}

variable "docker_build_tags" {
  type        = list(string)
  description = "A list of tags for the docker image"
  default     = ["lastest"]
}

variable "docker_build_args" {
    type = map
    description = "A dictionary of build args for the docker image"
    default = {}
}

variable "docker_build_labels" {
  type = map
  description = "The labels for the docker build image"
  default = {
      author: "Confiant"
  }
}
