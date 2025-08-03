# data "terraform_remote_state" "network" {
#   backend   = "s3"
#   workspace = terraform.workspace

#   config = {
#     bucket = "waev-infrastructure"
#     key    = "terraform.tfstate"
#     region = "us-east-1"
#   }
# }

module "application" {
  source = "./application"

  bucket_name = var.bucket_name
}

# module "security" {
#   source = "./security"

#   vpc_id = data.terraform_remote_state.network.outputs.vpc_id

#   ecs_sg_name   = var.ecs_sg_name
#   iam_role_name = var.iam_role_name
# }

# module "scaling" {
#   source = "./scaling"

#   vpc_id = data.terraform_remote_state.network.outputs.vpc_id

#   ecs_instance_profile_name = module.security.iam_instance_profile_name
#   ecs_security_group_ids    = [data.terraform_remote_state.network.outputs.vpc_security_group_id, module.security.ecs_sg_id]
#   ecs_cluster_name          = var.ecs_cluster_name

#   ecs_lc_name          = var.ecs_lc_name
#   ecs_lc_instance_type = var.ecs_lc_instance_type

#   ecs_lb_subnet_ids = data.terraform_remote_state.network.outputs.public_subnets
#   ecs_lb_name       = var.ecs_as_name

#   ecs_as_name                 = var.ecs_as_name
#   ecs_as_desired_capacity     = var.ecs_as_desired_capacity
#   ecs_as_min_capacity         = var.ecs_as_min_capacity
#   ecs_as_max_capacity         = var.ecs_as_max_capacity
#   ecs_as_health_check_timeout = var.ecs_as_health_check_timeout
#   ecs_as_health_check_type    = var.ecs_as_health_check_type

#   depends_on = [
#     module.security
#   ]
# }

# module "docker" {
#   source = "./docker"

#   ecr_repo_name = var.ecr_repo_name
#   ecr_repo_tag  = var.ecr_repo_tag

#   docker_build_dir    = abspath("${path.cwd}/../../")
#   docker_build_tags   = var.docker_build_tags
#   docker_build_args   = var.docker_build_args
#   docker_build_labels = var.docker_build_labels
# }

# module "application" {
#   source = "./application"

#   docker_repo_name = var.ecr_repo_name
#   docker_repo      = replace(module.docker.ecr_repo_url, "https://", "")
#   docker_tag       = var.ecr_repo_tag

#   ecs_cluster_name               = var.ecs_cluster_name
#   ecs_service_security_group_ids = [data.terraform_remote_state.network.outputs.vpc_security_group_id, module.security.ecs_sg_id]
#   ecs_service_lb_arns            = [module.scaling.lb_target_arn]
#   ecs_service_subnets            = data.terraform_remote_state.network.outputs.private_subnets
#   ecs_task_family                = var.ecs_task_family
#   ecs_task_name                  = var.ecs_task_name
#   ecs_task_capacity              = var.ecs_task_capacity

#   depends_on = [
#     module.security,
#     module.scaling,
#     module.docker
#   ]
# }


