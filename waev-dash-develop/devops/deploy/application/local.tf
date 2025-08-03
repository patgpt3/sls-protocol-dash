locals {
  subdomain = terraform.workspace == "production" || terraform.workspace == "development" || terraform.workspace == "staging" ? "app${terraform.workspace == "production" ? "" : "-${terraform.workspace}"}" : terraform.workspace
  domain    = "${local.subdomain}.waevdata.com"

  domains = {
    "${local.subdomain}"     = local.domain,
    "www.${local.subdomain}" = "www.${local.domain}"
  }
}
