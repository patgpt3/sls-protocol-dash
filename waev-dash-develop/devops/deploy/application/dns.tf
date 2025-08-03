resource "cloudflare_record" "acm" {
  for_each = {
    for subdomain, domain in local.domains : subdomain => {
      for opt in aws_acm_certificate.cert.domain_validation_options : opt.domain_name => {
        name  = trimsuffix(opt.resource_record_name, ".waevdata.com")
        type  = opt.resource_record_type
        value = trimsuffix(opt.resource_record_value, ".")
      }
    }[domain]
  }

  zone_id = data.cloudflare_zone.app.id

  name  = each.value.name
  type  = each.value.type
  value = each.value.value

  // Must be set to false. ACM validation false otherwise
  proxied         = false
  allow_overwrite = true
}

resource "cloudflare_record" "app_cname" {
  for_each = local.domains

  zone_id         = data.cloudflare_zone.app.id
  name            = each.key
  value           = aws_cloudfront_distribution.dist.domain_name
  type            = "CNAME"
  ttl             = 1
  proxied         = true
  allow_overwrite = true

  depends_on = [
    aws_s3_bucket.app
  ]
}
