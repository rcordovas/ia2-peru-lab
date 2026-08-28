# Pipeline de seguridad

El workflow `.github/workflows/security.yml` ejecuta cuatro bloques:

| Tecnica | Implementacion | Resultado |
|---|---|---|
| SAST | GitHub CodeQL `security-extended` | Alertas de codigo y SARIF en Code Scanning |
| SCA | Trivy filesystem | CVE de dependencias directas/transitivas; SARIF (incluye `modules/payment-module/package-lock.json`) |
| SBOM | `@cyclonedx/cyclonedx-npm` | `reports/sbom.cdx.json` CycloneDX 1.6 |
| Secret scan | Gitleaks 8.30.1 | `reports/gitleaks.json`, redactado |
| IaC scan | Trivy config | SARIF de IaC, incluido fixture no desplegable |
| Container scan | Trivy image | SARIF de `ia2-peru:qa` con base obsoleta |

Las etapas del laboratorio usan `exit-code 0` para que los alumnos puedan revisar artefactos aunque existan hallazgos sembrados. Como ejercicio de madurez, convierta posteriormente los hallazgos confirmados en quality gates por severidad y contexto.

Nota: CodeQL en repositorios privados de organizaciones requiere las capacidades/licenciamiento de GitHub Code Security correspondientes; en repositorios publicos de GitHub.com CodeQL esta disponible bajo sus terminos aplicables.
