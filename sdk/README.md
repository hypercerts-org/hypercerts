# Hypercert SDK

## Set up

### Configuration

1. Copy `.env.template` to `.env`
2. Create an API key on [NFT.Storage](https://nft.storage/) by going [here](https://nft.storage/manage). Add this to your config.


### Dependencies

```bash
yarn install
```

### Build

```bash
yarn build
```

`yarn lerna run bootstrap`

`yarn lerna run tsc`

## Interface

[API documentation](/docs/API.md)
[Graph playground](https://thegraph.com/hosted-service/subgraph/bitbeckers/hypercerts-dev)

## Packages

### Contracts

Typed instances of Hypercert protocol

### Metadata

Metadata validator/generator/uploader

### Graph Client

GraphQL client for Hypercerts with predefined queries and client

### Types

- Contracts
- Graph entities
- Hypercert domain


-- to be rewritten:
* Example metadata schema's
* Yup validation


Wrapper for [Graph-client](https://github.com/graphprotocol/graph-client)