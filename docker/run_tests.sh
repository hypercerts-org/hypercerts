#!/bin/bash
set -euxo pipefail

source /usr/src/app/node_modules/app.env.sh

cd "${REPO_DIR}"

export DISPLAY=:1

echo "starting xvfb"
Xvfb :1 -screen 0 1024x768x24 &

echo "starting fluxbox"
fluxbox &

echo "starting vnc"
x11vnc -display :1 -bg -nopw -xkb --rfbport 9300

yarn playwright install-deps
yarn playwright install

echo "chilling for now"
sleep 10000
yarn playwright test
