# In order to support multiple development environments we use a custom base
# node built from the graph node repo
# See: https://github.com/graphprotocol/graph-node
FROM ghcr.io/hypercerts-org/graph-node:3d04464ccfe08f3850b58dfcf9c6afc12f726a44

RUN apt-get update && apt-get install -y curl