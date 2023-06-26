#!/bin/bash

# Script to run after the graph has started running

set -euxo pipefail

# Load application environment variables
source /usr/src/app/node_modules/app.env.sh

export GRAPH_URL=$DOCKER_INTERNAL_GRAPH_RPC 
export IPFS_URL=$DOCKER_INTERNAL_IPFS_URL 
export SUBGRAPH_NAME=hypercerts-admin/hypercerts-hardhat 
export SUBGRAPH_MANIFEST=.test.subgraph.yaml 
export VERSION_LABEL=v0.0.1 

echo "Deploying the subgraph"

cd "$REPO_DIR/graph"

cat subgraph.yaml | sed 's/network: .*/network: hardhat/;s/address: ".*"/address: "'"${NEXT_PUBLIC_CONTRACT_ADDRESS}"'"/;s/startBlock: .*/startBlock: '"${CONTRACT_DEPLOYED_BLOCK_NUMBER}"'/' > $SUBGRAPH_MANIFEST
prepend_text="# This file is generated for local testing. It should not be committed"

printf '%s\n%s\n' "${prepend_text}" "$(cat $SUBGRAPH_MANIFEST)" > $SUBGRAPH_MANIFEST

yarn create-from-env-args
yarn deploy-from-env-args
