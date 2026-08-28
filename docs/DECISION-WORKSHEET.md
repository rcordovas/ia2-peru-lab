# Hoja de decision - release candidate IA2 Peru

Estos cinco hallazgos representan situaciones del pipeline. El equipo debe decidir que hacer antes de aprobar un despliegue manual.

| ID | Hallazgo | Contexto | Decision del equipo | Evidencia | Requisito/prueba |
|---|---|---|---|---|---|
| H-01 | Token de sesion registrado en log de la aplicacion | API de transferencias, entorno productivo-like; log visible por operaciones |  |  |  |
| H-02 | Dependencia indirecta con CVE critica y referencia publica | Libreria transitiva del modulo de pagos |  |  |  |
| H-03 | Validacion de monto solo implementada en frontend | Flujo transaccional principal; backend no valida limites ni moneda |  |  |  |
| H-04 | Posible falso positivo SAST en utilidad heredada | Funcion auxiliar sin ruta activa de ejecucion |  |  |  |
| H-05 | Imagen base del contenedor con version obsoleta del SO/runtime | Solo imagen QA, sin datos reales |  |  |  |
