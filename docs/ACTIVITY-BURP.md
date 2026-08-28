# Actividad 2 - DAST basico con Burp Suite e Intruder

> Alcance estricto: solo la instancia IA2 Peru autorizada por el docente. Datos sinteticos. No usar payloads destructivos, cargas de denegacion de servicio ni tecnicas contra terceros.

## Objetivo
Interceptar una solicitud HTTP valida, modificar parametros de manera controlada con Burp Repeater/Intruder, comparar respuestas y demostrar si las reglas de negocio se validan realmente en el backend.

## Preparacion
1. Configure el navegador para usar Burp como proxy.
2. Abra `http://<IP-o-DNS-del-lab>/` e inicie sesion con las credenciales demo mostradas en la interfaz.
3. Active `Proxy > Intercept` y capture una solicitud `POST /api/transfers/preview` con un monto valido, por ejemplo `100.00 PEN`.
4. Envie la solicitud a Repeater para confirmar una linea base `HTTP 200`.

## Ejercicio A - Monto fuera del limite del frontend
La interfaz declara un limite de 5,000. En Repeater, cambie unicamente `amount` a valores de prueba no destructivos, por ejemplo `5000`, `5000.01` y `7500`.

Evidencia esperada a documentar:
- status HTTP;
- campo `accepted`;
- `projectedBalance`;
- diferencia entre la validacion del navegador y la respuesta de la API.

Si el backend acepta `5000.01` o `7500`, relacione la evidencia con H-03.

## Ejercicio B - Moneda no ofrecida por la UI
Parta de la misma solicitud y cambie `currency` a un valor sintetico no mostrado por la interfaz, por ejemplo `XYZ`.

Criterio de hallazgo: si la API responde exitosamente sin rechazar una moneda fuera del catalogo server-side, documente la ausencia de validacion de reglas transaccionales en backend.

## Ejercicio C - Intruder con lista pequena y controlada
1. Envie `POST /api/transfers/preview` a Intruder.
2. Marque SOLO el valor de `amount` como posicion de payload.
3. Use una lista corta: `0`, `1`, `4999.99`, `5000`, `5000.01`, `7500`, `-1`.
4. Ejecute a baja concurrencia. No use listas extensas ni ataques de carga.
5. Ordene resultados por Status, Length y tiempo; abra las respuestas anomalas.

Una implementacion correcta deberia rechazar valores <=0 y >5000 con un codigo 4xx y mensaje consistente. El laboratorio deliberadamente permite observar el comportamiento contrario.

## Ejercicio D - Correlacion con logs para H-01
Tras iniciar sesion, el docente/operador del servidor ejecuta:

```bash
sudo journalctl -u ia2-peru --since "10 minutes ago" | grep login_success
```

El alumno NO reutiliza el token. Solo verifica si un secreto de sesion fue escrito en el log y documenta el riesgo de exposicion a operadores o sistemas de logging.

## Resultado combinado esperado
Burp confirma principalmente H-03. H-01 se corrobora con logs; H-02 con SCA; H-04 con SAST + reachability; H-05 con container scan + contexto de despliegue.
