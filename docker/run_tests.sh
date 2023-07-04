#!/bin/bash
set -euo pipefail

source /usr/src/app/node_modules/app.env.sh

cd "${REPO_DIR}"

export DISPLAY=:99
apt-get install -y nginx 

echo "starting nginx"
nginx -c /etc/nginx/e2e_proxy.conf

echo "starting xvfb"
Xvfb "${DISPLAY}" -ac -listen tcp -screen 0 1200x800x24 &

echo "starting fluxbox"
fluxbox -display "${DISPLAY}" -screen 0 &

echo "starting vnc with password 'test'"
x11vnc -display "${DISPLAY}.0" -forever -bg -passwd password 

yarn playwright install-deps
yarn playwright install

yarn playwright test
