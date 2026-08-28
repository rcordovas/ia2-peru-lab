#!/usr/bin/env bash
set -euo pipefail
mkdir -p reports

echo '[1/4] SCA + vulnerabilidades de filesystem con Trivy'
docker run --rm -v "$PWD:/work" -w /work aquasec/trivy:0.72.0 fs \
  --scanners vuln \
  --severity HIGH,CRITICAL \
  --format table \
  --output reports/trivy-fs.txt . || true

echo '[2/4] SBOM CycloneDX'
npm run sbom

echo '[3/4] Secret scan con Gitleaks (hallazgo sintetico esperado)'
docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:v8.30.1 dir /repo \
  --redact \
  --report-format json \
  --report-path /repo/reports/gitleaks.json \
  --exit-code 0

echo '[4/4] IaC scan con Trivy'
docker run --rm -v "$PWD:/work" -w /work aquasec/trivy:0.72.0 config \
  --format table \
  --output reports/trivy-iac.txt iac || true

echo 'Reportes generados en ./reports'
