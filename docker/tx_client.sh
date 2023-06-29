#!/bin/bash

source /usr/src/app/node_modules/app.env.sh

cd "${REPO_DIR}/contracts"

yarn hardhat --network localhost test-tx-client