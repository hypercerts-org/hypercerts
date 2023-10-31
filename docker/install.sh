#!/bin/bash

git config --global --add safe.directory /usr/src/app
#yarn install --non-interactive --frozen-lockfile
#curl -fsSL https://get.pnpm.io/install.sh | SHELL=bash sh -
#source /root/.bashrc

corepack enable
pnpm --version
pnpm install --frozen-lockfile