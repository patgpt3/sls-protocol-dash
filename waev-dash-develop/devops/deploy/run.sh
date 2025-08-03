#!/bin/bash

# function to get the absolute path from a relative path
function abs_filename() {
  echo "$(cd "$(dirname "$1")" && pwd)/$(basename "$1")"
}

# get the absolute path to build docker
DOCKER_BUILD_DIR=$(abs_filename $PWD/../../src)
echo "Using Docker Build Directory $DOCKER_BUILD_DIR"

# run the terraform command
ACTION=${1:-plan}
shift;
ARGS=$@
terraform fmt --write
terraform get
terraform init
terraform $ACTION --var-file=.tfvars -var="docker_build_dir=$DOCKER_BUILD_DIR" $ARGS