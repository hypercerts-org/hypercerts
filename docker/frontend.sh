#!/bin/bash
set -euo pipefail

source /usr/src/app/node_modules/app.env.sh

cd "${REPO_DIR}/frontend"

if [[ "$ENVIRONMENT" == "tests" ]]; then
    echo "Building a production-like environment for testing"
    yarn build
    yarn start
else
    echo "Running the dev environment"
    yarn dev
fi
