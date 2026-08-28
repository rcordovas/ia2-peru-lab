# IA2 Peru - AppSec / DevSecOps / Burp Lab

Repositorio ficticio para una practica autorizada de seguridad de aplicaciones financieras. Incluye una aplicacion Node.js/Express con datos sinteticos y hallazgos deliberados para revision humana, GitHub Copilot, CodeQL, Trivy, CycloneDX, Gitleaks, IaC scanning, container scanning y DAST basico con Burp Suite.

> **No es una aplicacion de produccion.** Contiene debilidades intencionales. Despliegue solo en una cuenta/red de laboratorio autorizada y nunca conecte datos o credenciales reales.

## Laboratorios incluidos
1. **Revision segura del repositorio:** `docs/ACTIVITY-1.md` y `docs/REVIEW-PROMPT.md`.
2. **Supply chain / DevSecOps:** `.github/workflows/security.yml`, `docs/PIPELINE.md` y `docs/SECURITY-TECHNIQUES.md`.
3. **DAST basico con Burp + Intruder:** `docs/ACTIVITY-BURP.md`.
4. **Decision de release:** `docs/DECISION-WORKSHEET.md` y `docs/FINDING-TEMPLATE.md`.
5. **Despliegue AWS Ubuntu:** `iac/cloudformation/ia2-lab.yml` + `deploy/install-ubuntu.sh`.

## Inicio local
Requiere Node.js >= 20.18.

```bash
npm install --ignore-scripts --no-audit --no-fund
npm start
```

Abra `http://127.0.0.1:3000`.

Credenciales sinteticas:
- Usuario: `demo@ia2-peru.local`
- Contrasena: `Lab-IA2-2026!`

## Estructura
```text
src/                     API y logica de negocio
public/                  frontend web
docker/                  imagen QA vulnerable + imagen productiva de referencia
iac/                     CloudFormation desplegable + fixture IaC no aplicable
.github/workflows/        pipeline SAST/SCA/SBOM/Secrets/IaC/Container
vendor/demo-payment-sdk/ dependencia ficticia con dependencia transitiva vulnerable
modules/payment-module/ lockfile del modulo de pagos para analisis SCA
lab-fixtures/             secretos sinteticos para secret scanning
docs/                    guias del alumno
deploy/                   systemd + Nginx + instalador Ubuntu
```

## Seguridad del laboratorio
- La app opera solo con saldos en memoria.
- No integra bancos, pagos, correo, AWS API ni servicios externos.
- Los tokens y secretos sembrados son sinteticos y no pertenecen a cuentas reales.
- El ejercicio de Intruder usa listas pequenas y baja concurrencia sobre un unico endpoint autorizado.
- Finalizada la practica, destruya la EC2/stack o cierre el acceso de red.
