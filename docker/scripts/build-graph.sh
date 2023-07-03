#!/bin/bash
set -euxo pipefail

# Save the script's directory for later
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Creating a temporary directory to checkout the graph"
temp_dir=$(mktemp -d)

cd "$temp_dir"

# checkout the graph 
git clone https://github.com/graphprotocol/graph-node.git
cd graph-node/

clean_up() {
    rm -rf "$temp_dir"
    echo "Cleaning up temp directory"
}
trap clean_up EXIT

if [ -d .git ]
then
    COMMIT_SHA=$(git rev-parse HEAD)
    TAG_NAME=$(git tag --points-at HEAD)
    REPO_NAME="Checkout of $(git remote get-url origin) at $(git describe --dirty)"
    BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
fi

# This needs to be set because of dealing with M1 macs and github actions.
# Github actions cannot seem to build _some_ arm64 images. This gets around that
# by forcing us to tag with the platform.
DOCKER_PLATFORM=${DOCKER_PLATFORM:-amd64}

for stage in graph-node-build graph-node graph-node-debug
do
    docker build --target $stage \
            --build-arg "COMMIT_SHA=$COMMIT_SHA" \
            --build-arg "REPO_NAME=$REPO_NAME" \
            --build-arg "BRANCH_NAME=$BRANCH_NAME" \
            --build-arg "TAG_NAME=$TAG_NAME" \
	        -t ghcr.io/hypercerts-org/$stage:${COMMIT_SHA}-${DOCKER_PLATFORM} \
            --push \
            -f docker/Dockerfile .
done

cd "${script_dir}/.."
docker build \
    -t "ghcr.io/hypercerts-org/graph-node-dev:${COMMIT_SHA}-${DOCKER_PLATFORM}" \
    --build-arg "DOCKER_PLATFORM=${DOCKER_PLATFORM}" \
    --build-arg "GRAPH_COMMIT_SHA=${COMMIT_SHA}" \
    --push \
    -f graph.Dockerfile .