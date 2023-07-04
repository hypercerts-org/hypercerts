#!/bin/bash
set -euxo pipefail

# Reinitializes a test harness that can be used for local development or end to
# end testing with playwright

REPO_DIR=${REPO_DIR:-}
LOCAL_TESTING_ADDRESS=${LOCAL_TESTING_ADDRESS:-}
deploy_json=/deploy.json

export LOCALHOST_NETWORK_URL=http://localchain:8545
export NEXT_PUBLIC_DEFAULT_CHAIN_ID=31337

function hardhat_local() {
    yarn hardhat --network localhost $@
}

# Clean up stateful data related to any previous invocation of this
# docker-compose setup
rm -rf /postgres/*
rm -rf /ipfs_staging/*
rm -rf /ipfs_data/*

# Allow passing in the repo directory. Otherwise automagically get the correct
# directory based on this script's path
if [[ -z "${REPO_DIR}" ]]; then
    # Ensure we're working from the script's directory. This is a bit brittle but
    # it's intended to be bespoke to this repo
    script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
    cd "$script_dir"/..
    REPO_DIR=$( pwd )
fi

# Rebuild the project if necessary
# TODO this is failing in docker. Need to figure out why. Probably dude to shared vms
cd "${REPO_DIR}"
yarn build:contracts
yarn build:defender
yarn build:graph
yarn build:sdk

cd "${REPO_DIR}/contracts"

# Deploy the contract
echo "Deploy the contract"
hardhat_local deploy --output "$deploy_json"

# Transfer token to a specific account if that account has been specified
if [[ ! -z "${LOCAL_TESTING_ADDRESS}" ]]; then
    echo "Funding ${LOCAL_TESTING_ADDRESS}"
    hardhat_local transfer-from-test-account --dest "$LOCAL_TESTING_ADDRESS" --amount 5000
fi

contract_address=$(jq '.address' -r "$deploy_json")
contract_deployed_block_number=$(jq '.blockNumber' -r "$deploy_json")
echo "Contract address to be loaded: $contract_address"

# Have these here so we can do some interpolating
GRAPH_BASE_URL=http://${FRONTEND_GRAPH_HOST}:${FRONTEND_GRAPH_HTTP_PORT}/subgraphs/name
GRAPH_NAME=hypercerts-hardhat
GRAPH_NAMESPACE=hypercerts-admin
NEXT_PUBLIC_GRAPH_URL=${GRAPH_BASE_URL}/${GRAPH_NAMESPACE}/${GRAPH_NAME}

cd $REPO_DIR
# Run a full build (this seems to be necessary)
yarn build

cat <<EOF > /usr/src/app/node_modules/app.env.sh
# Generate an environment file from the contract deployment
export REPO_DIR=${REPO_DIR}
export NEXT_PUBLIC_DEFAULT_CHAIN_ID=31337
export NEXT_PUBLIC_CHAIN_NAME=hardhat
export NEXT_PUBLIC_CONTRACT_ADDRESS="${contract_address}"
export CONTRACT_DEPLOYED_BLOCK_NUMBER="${contract_deployed_block_number}"
export NEXT_PUBLIC_UNSAFE_FORCE_OVERRIDE_CONFIG=1
export NEXT_PUBLIC_RPC_URL=http://${FRONTEND_RPC_HOST}:${FRONTEND_RPC_PORT}
export FRONTEND_RPC_PORT=${FRONTEND_RPC_PORT}
export FRONTEND_RPC_HOST=${FRONTEND_RPC_HOST}
export FRONTEND_GRAPH_HOST=${FRONTEND_GRAPH_HOST}
export FRONTEND_GRAPH_HTTP_PORT=${FRONTEND_GRAPH_HTTP_PORT}
export FRONTEND_GRAPH_WS_PORT=${FRONTEND_GRAPH_WS_PORT}
export FRONTEND_GRAPH_JSON_RPC_PORT=${FRONTEND_GRAPH_JSON_RPC_PORT}
export FRONTEND_GRAPH_INDEX_STATUS_PORT=${FRONTEND_GRAPH_INDEX_STATUS_PORT}
export FRONTEND_IPFS_HOST=${FRONTEND_IPFS_HOST}
export FRONTEND_IPFS_LIBP2P_PORT=${FRONTEND_IPFS_LIBP2P_PORT}
export FRONTEND_IPFS_API_PORT=${FRONTEND_IPFS_API_PORT}
export FRONTEND_IPFS_GATEWAY_PORT=${FRONTEND_IPFS_GATEWAY_PORT}
export FRONTEND_PORT=${FRONTEND_PORT}
export FRONTEND_HOST=${FRONTEND_HOST}

export NEXT_PUBLIC_GRAPH_URL=${NEXT_PUBLIC_GRAPH_URL}

export DOCKER_INTERNAL_GRAPH_RPC_URL=http://graph:8020
export DOCKER_INTERNAL_GRAPH_HTTP_URL=http://graph:8000
export DOCKER_INTERNAL_IPFS_URL=http://ipfs:5001
export PLASMIC_PROJECT_ID="$PLASMIC_PROJECT_ID"
export PLASMIC_PROJECT_API_TOKEN="$PLASMIC_PROJECT_API_TOKEN"
export LOCALHOST_NETWORK_URL=${LOCALHOST_NETWORK_URL}
export NEXT_PUBLIC_NFT_STORAGE_TOKEN=${NEXT_PUBLIC_NFT_STORAGE_TOKEN}
export NEXT_PUBLIC_WEB3_STORAGE_TOKEN=${NEXT_PUBLIC_WEB3_STORAGE_TOKEN}
export NEXT_PUBLIC_WALLETCONNECT_ID=${NEXT_PUBLIC_WALLETCONNECT_ID}
export NEXT_PUBLIC_DOMAIN=${NEXT_PUBLIC_DOMAIN}
export NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
export NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
export NEXT_PUBLIC_SUPABASE_TABLE=${NEXT_PUBLIC_SUPABASE_TABLE}
EOF
