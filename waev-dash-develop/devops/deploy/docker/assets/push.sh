#!/bin/bash

ECR_BASE_URL=$ACCOUNT_ID.dkr.ecr.$REGION_ID.amazonaws.com

aws ecr get-login-password --region $REGION_ID | docker login --username AWS --password-stdin $ECR_BASE_URL

docker push $ECR_BASE_URL/$REPO_NAME:$REPO_TAG
