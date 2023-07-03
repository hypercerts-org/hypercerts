ARG DOCKER_PLATFORM=amd64
ARG GRAPH_COMMIT_SHA

# In order to support multiple development environments we use a custom base
# node built from the graph node repo
# See: https://github.com/graphprotocol/graph-node
FROM ghcr.io/hypercerts-org/graph-node:${GRAPH_COMMIT_SHA}-${DOCKER_PLATFORM}

RUN apt-get update && apt-get install -y curl
