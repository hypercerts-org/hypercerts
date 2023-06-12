#!/bin/bash

# Script to run after the graph has started running

set -euxo pipefail

# Load application environment variables
source /usr/src/app/node_modules/app.env.sh

echo "Deploying the subgraph"

cd "$REPO_DIR/graph"
npm install -g @graphprotocol/graph-cli
yarn install

cat subgraph.yaml | sed 's/address: ".*"/'"${NEXT_PUBLIC_CONTRACT_ADDRESS}"'/;s/startBlock: .*/startBlock: '"${CONTRACT_DEPLOYED_BLOCK_NUMBER}"'/' > .test.subgraph.yaml

export GRAPH_URL=$DOCKER_INTERNAL_GRAPH_RPC 
export IPFS_URL=$DOCKER_INTERNAL_IPFS_URL 
export SUBGRAPH_NAME=hypercerts-admin/hypercerts-hardhat 
export SUBGRAPH_MANIFEST=.test.subgraph.yaml 
export VERSION_LABEL=v0.0.1 

yarn create_with_env
yarn deploy_with_env