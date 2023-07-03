#!/bin/bash

# checkout the graph 
git clone https://github.com/graphprotocol/graph-node.git

cd graph-node/

if [ -d .git ]
then
    COMMIT_SHA=$(git rev-parse HEAD)
    TAG_NAME=$(git tag --points-at HEAD)
    REPO_NAME="Checkout of $(git remote get-url origin) at $(git describe --dirty)"
    BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
fi

DOCKER_PLATFORM=${DOCKER_PLATFORM:-amd64}

for stage in graph-node-build graph-node graph-node-debug
do
    docker buildx build --target $stage \
            --build-arg "COMMIT_SHA=$COMMIT_SHA" \
            --build-arg "REPO_NAME=$REPO_NAME" \
            --build-arg "BRANCH_NAME=$BRANCH_NAME" \
            --build-arg "TAG_NAME=$TAG_NAME" \
	        -t ghcr.io/hypercerts-org/$stage:${COMMIT_SHA}-${DOCKER_PLATFORM} \
            --platform "linux/${DOCKER_PLATFORM}" \
            --push \
            -f docker/Dockerfile .
done