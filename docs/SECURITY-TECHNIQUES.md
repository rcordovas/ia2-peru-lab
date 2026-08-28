# Cobertura de tecnicas de seguridad

| Tecnica | Que revisa | Cuando usar en este laboratorio | Implementacion |
|---|---|---|---|
| SAST | Codigo fuente y patrones inseguros | PR / build temprano | CodeQL sobre JavaScript y GitHub Actions |
| SCA | Dependencias de terceros, CVE y licencias | PR y release candidate | Trivy filesystem; modulo de pagos con dependencia transitiva |
| DAST | Aplicacion en ejecucion desde el exterior | Ambiente de pruebas con datos sinteticos | Burp Proxy, Repeater e Intruder |
| IAST | Codigo + ejecucion instrumentada en tiempo real | Durante pruebas funcionales | Extension opcional: requiere agente IAST compatible; no se instala por defecto |
| Secret scan | Credenciales y tokens en repositorio/historial | Commit, PR e historico | Gitleaks + validacion local de patrones |
| IaC scan | Configuracion declarativa cloud | Antes del aprovisionamiento | Trivy config sobre CloudFormation/Terraform de entrenamiento |
| Container scan | Paquetes del SO, runtime y dependencias de la imagen | Antes de publicar/desplegar imagen | Trivy image sobre `docker/Dockerfile.qa` |

## Nota sobre IAST
El repositorio deja IAST como extension porque normalmente requiere instrumentar el runtime con un agente o plataforma especifica. Para una clase se puede incorporar el agente elegido durante pruebas funcionales y contrastar sus hallazgos con SAST/DAST, manteniendo el mismo requisito de trazabilidad y validacion humana.
