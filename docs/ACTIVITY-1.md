# Actividad 1 - Revision segura del repositorio IA2 Peru

## Objetivo
Evaluar un repositorio ficticio mediante revision humana y apoyo de Copilot/IA, generando hallazgos trazables y requisitos verificables. El foco no es aceptar automaticamente una sugerencia de IA, sino validarla contra evidencia real del repositorio.

## Alcance
- `src/`, `public/`, `vendor/`, `docker/`, `iac/`, `.github/workflows/`.
- Solo datos sinteticos y entorno autorizado.
- No ejecutar pruebas contra otros hosts, dominios o servicios.

## Flujo de trabajo recomendado
1. Revise manualmente arquitectura, rutas, controles y dependencias.
2. Ejecute el prompt de `docs/REVIEW-PROMPT.md` con GitHub Copilot sobre el repositorio.
3. Para cada recomendacion de IA, busque evidencia exacta: archivo + linea + funcion + flujo de ejecucion.
4. Ejecute el pipeline de seguridad o `scripts/security-local.sh`.
5. Clasifique cada hallazgo como: `confirmado`, `requiere-validacion`, `falso-positivo/no-alcanzable`, `aceptado-temporalmente` o `corregir-antes-de-release`.
6. Redacte un requisito verificable con criterio de aceptacion y prueba.

## Entregable minimo por hallazgo
| Campo | Contenido esperado |
|---|---|
| ID | H-xx |
| Tecnica | SAST / SCA / DAST / Secret / IaC / Container |
| Evidencia | Archivo, linea, funcion o request/response |
| Riesgo | Que podria ocurrir |
| Impacto de negocio | Fraude, fuga, indisponibilidad, incumplimiento, etc. |
| Decision | Corregir / aceptar / investigar / falso positivo |
| Requisito | Enunciado verificable |
| Prueba | Como demostrar que el control funciona |
| Confianza | Alta / media / baja y por que |

## Reglas de decision
- Una alerta de herramienta no es automaticamente una vulnerabilidad explotable.
- Una dependencia vulnerable debe analizarse por version, alcance, reachability, exposicion y disponibilidad de parche.
- Un hallazgo de log debe considerar quien accede a los logs y si el dato permite reutilizacion o escalamiento.
- Un control de frontend nunca reemplaza una validacion server-side para reglas transaccionales.
- Una imagen obsoleta sigue siendo deuda tecnica aunque el contexto pueda reducir su riesgo inmediato.
