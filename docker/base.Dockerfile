FROM node:18

RUN apt-get update \
    && apt-get install -y jq \
    && npm install -g @graphprotocol/graph-cli
