terraform {
  backend "s3" {
    bucket  = "waevdata-ops-state"
    key     = "dashboard/terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
