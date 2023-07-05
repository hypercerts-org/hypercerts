#!/bin/bash
set -euxo pipefail

script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# This needs to be set because of dealing with M1 macs and github actions.
# Github actions cannot seem to build _some_ arm64 images. This gets around that
# by forcing us to tag with the platform.
DOCKER_PLATFORM=${DOCKER_PLATFORM:-amd64}

cd "$script_dir/.."

docker build \
    -t "ghcr.io/hypercerts-org/node-dev-18:1.0-${DOCKER_PLATFORM}" \
    -f base.Dockerfile .
docker push "ghcr.io/hypercerts-org/node-dev-18:1.0-${DOCKER_PLATFORM}"