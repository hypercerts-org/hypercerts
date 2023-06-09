#!/bin/bash
set -euxo pipefail

# Initializes a test harness that can be used for local development or end to
# end testing with playwright

REPO_DIR=${REPO_DIR:-}
HYPERCERTS_LOCAL_TESTING_ADDRESS=${HYPERCERTS_LOCAL_TESTING_ADDRESS:-}
deploy_json=/deploy.json

function hardhat() {
    yarn hardhat --network localhost $@
}

# Install dependencies if needed
if [[ -z "$(which jq)" ]]; then
    apt-get update && apt-get install -y jq
fi

# Allow passing in the repo directory. Otherwise automagically get the correct
# directory based on this script's path
if [[ -z "${REPO_DIR}" ]]; then
    # Ensure we're working from the script's directory. This is a bit brittle but
    # it's intended to be bespoke to this repo
    script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
    cd "$script_dir"/..
    REPO_DIR=$( pwd )
fi

cd "${REPO_DIR}"
#yarn build

cd "${REPO_DIR}/contracts"

# Deploy the contract
echo "Deploy the contract"
hardhat deploy --output "$deploy_json"

# Transfer token to a specific account if that account has been specified
if [[ ! -z "${HYPERCERTS_LOCAL_TESTING_ADDRESS}" ]]; then
    echo "Funding ${HYPERCERTS_LOCAL_TESTING_ADDRESS}"
    hardhat transfer-from-test-account --dest "$HYPERCERTS_LOCAL_TESTING_ADDRESS" --amount 1000
fi

contract_address=$(jq '.address' -r "$deploy_json")
echo "Contract address to be loaded: $contract_address"

# Generate an environment file from the contract deployment
export NEXT_PUBLIC_DEFAULT_CHAIN_ID=31337
export NEXT_PUBLIC_CHAIN_NAME=hardhat
export NEXT_PUBLIC_GRAPH_NAME=hypercerts-hardhat
export NEXT_PUBLIC_CONTRACT_ADDRESS="${contract_address}"
export NEXT_PUBLIC_UNSAFE_FORCE_OVERRIDEN_VALUES=1
#export NEXT_PUBLIC_GRAPH_URL=
export NEXT_PUBLIC_RPC_URL=http://localhost:8545
export PLASMIC_PROJECT_ID="$PLASMIC_PROJECT_ID"
export PLASMIC_PROJECT_API_TOKEN="$PLASMIC_PROJECT_API_TOKEN"

# Run the frontend dev server
cd $REPO_DIR/frontend

yarn run dev