resource "aws_s3_bucket" "cache" {
  bucket = "${local.domain}-cache"
}

resource "aws_s3_bucket" "app" {
  for_each = local.domains
  bucket   = each.value
}

resource "aws_s3_bucket_acl" "app" {
  for_each = aws_s3_bucket.app

  bucket = each.value.id

  acl = "private"
}

resource "aws_s3_bucket_policy" "site" {
  for_each = aws_s3_bucket.app

  bucket = each.value.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "PublicReadGetObject"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity ${aws_cloudfront_origin_access_identity.default.id}"
        }
        Action = ["s3:*"]
        Resource = [
          each.value.arn,
          "${each.value.arn}/*",
        ]
      },
    ]
  })
}

resource "null_resource" "remove_and_upload_to_s3" {
  for_each = aws_s3_bucket.app

  triggers = {
    sync_time = timestamp()
  }

  provisioner "local-exec" {
    command = "aws s3 sync ../../build s3://${each.value.id}"
  }
}
