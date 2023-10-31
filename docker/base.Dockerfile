FROM node:18

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm --version \
    && apt-get update \
    && apt-get install -y jq \
    && npm install -g @graphprotocol/graph-cli
