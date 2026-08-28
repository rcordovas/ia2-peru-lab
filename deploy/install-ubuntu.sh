#!/usr/bin/env bash
set -euo pipefail

if [[ ${EUID:-$(id -u)} -ne 0 ]]; then
  echo 'Ejecute como root: sudo bash deploy/install-ubuntu.sh'
  exit 1
fi

APP_DIR=/opt/ia2-peru
SRC_DIR=$(cd "$(dirname "$0")/.." && pwd)

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y ca-certificates curl gnupg nginx rsync

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p 'Number(process.versions.node.split(`.`)[0])')" -lt 20 ]]; then
  install -d -m 0755 /etc/apt/keyrings
  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
  echo 'deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main' > /etc/apt/sources.list.d/nodesource.list
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs
fi

id ia2lab >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin ia2lab
mkdir -p "$APP_DIR" /etc/ia2-peru
rsync -a --delete \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude 'reports' \
  "$SRC_DIR/" "$APP_DIR/"

cd "$APP_DIR"
npm install --omit=dev --ignore-scripts --no-audit --no-fund
chown -R ia2lab:ia2lab "$APP_DIR"

cat > /etc/ia2-peru/ia2-peru.env <<'ENVEOF'
NODE_ENV=production
LAB_MODE=true
PORT=3000
LOG_SESSION_TOKENS=true
SESSION_TTL_MS=3600000
ENVEOF
chmod 0640 /etc/ia2-peru/ia2-peru.env
chown root:ia2lab /etc/ia2-peru/ia2-peru.env

install -m 0644 "$APP_DIR/deploy/ia2-peru.service" /etc/systemd/system/ia2-peru.service
install -m 0644 "$APP_DIR/deploy/nginx-ia2-peru.conf" /etc/nginx/sites-available/ia2-peru
ln -sf /etc/nginx/sites-available/ia2-peru /etc/nginx/sites-enabled/ia2-peru
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl daemon-reload
systemctl enable --now ia2-peru nginx

echo 'IA2 Peru desplegado. Verifique: curl http://127.0.0.1/api/health'
echo 'Logs: sudo journalctl -u ia2-peru -f'
