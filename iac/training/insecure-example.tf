# NO APLICAR. Fixture deliberado para IaC scanning.
# Debe producir hallazgos de configuracion que el alumno documentara y corregira.
resource "aws_s3_bucket" "training_bad_example" {
  bucket = "ia2-peru-training-do-not-apply"
}

resource "aws_s3_bucket_public_access_block" "training_bad_example" {
  bucket                  = aws_s3_bucket.training_bad_example.id
  block_public_acls       = false
  ignore_public_acls      = false
  block_public_policy     = false
  restrict_public_buckets = false
}
