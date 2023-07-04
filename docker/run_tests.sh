#!/bin/bash
set -euo pipefail

source /usr/src/app/node_modules/app.env.sh

cd "${REPO_DIR}"

disp=:99
screen=0
export DISPLAY="${disp}.${screen}"

apt-get install -y nginx 

echo "starting nginx"
nginx -c /etc/nginx/e2e_proxy.conf

echo "starting xvfb"
Xvfb "${disp}" -ac -listen tcp -screen "${screen}" 1200x800x24 &

echo "starting fluxbox"
fluxbox -display "${disp}" -screen "${screen}" &

echo "starting vnc with password 'test'"
x11vnc -display "${DISPLAY}" -forever -bg -passwd password 

yarn playwright install-deps
yarn playwright install

yarn playwright test
