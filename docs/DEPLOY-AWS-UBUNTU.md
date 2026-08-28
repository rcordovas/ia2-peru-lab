# Despliegue en Ubuntu sobre AWS EC2

## 1. Crear la EC2
Use `iac/cloudformation/ia2-lab.yml`. Antes de lanzar el stack:
- seleccione una VPC y una subred publica con ruta a Internet Gateway;
- seleccione un KeyPair existente;
- establezca `AllowedSshCidr` a su IP publica `/32`;
- para una clase cerrada, restrinja `AllowedHttpCidr` al rango de los participantes o a un proxy/WAF;
- use una cuenta/proyecto de laboratorio separado de produccion.

Ejemplo con AWS CLI:

```bash
aws cloudformation deploy \
  --template-file iac/cloudformation/ia2-lab.yml \
  --stack-name ia2-peru-lab \
  --parameter-overrides \
    VpcId=vpc-XXXXXXXX \
    SubnetId=subnet-XXXXXXXX \
    KeyName=MI_KEYPAIR \
    AllowedSshCidr=203.0.113.25/32 \
    AllowedHttpCidr=203.0.113.0/24
```

Sustituya los CIDR de ejemplo por valores reales autorizados.

## 2. Copiar/clonar el repositorio
En la EC2 Ubuntu, copie o clone el repositorio en el home del usuario administrativo y ejecute:

```bash
cd ia2-peru-lab
sudo bash deploy/install-ubuntu.sh
```

El instalador:
- instala Node.js 22 y Nginx;
- despliega la app en `/opt/ia2-peru`;
- crea el usuario de servicio `ia2lab`;
- publica Nginx en puerto 80 y proxy interno a `127.0.0.1:3000`;
- habilita `systemd`.

## 3. Verificaciones

```bash
curl http://127.0.0.1/api/health
sudo systemctl status ia2-peru --no-pager
sudo nginx -t
sudo journalctl -u ia2-peru -n 30 --no-pager
```

## 4. Seguridad del entorno
Esta aplicacion contiene debilidades intencionales. No la conecte a datos, credenciales, redes o cuentas reales. No reutilice el servidor para produccion. Finalizada la clase, elimine el stack o cierre HTTP al publico.
