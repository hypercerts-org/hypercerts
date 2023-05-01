Hypercerts SDK Documentation / [Exports](modules.md)

# Hypercert SDK

## Set up

### Configuration

1. Obtain your own storage keys. We use both NFT.storage (for NFT metadata) and web3.storage (for other data).

- Create an API key on [NFT.Storage](https://nft.storage/) by going [here](https://nft.storage/manage). Add this to your
  config.
- Create an API key on [web3.storage](https://web3.storage/) by going [here](https://web3.storage/manage). Add this to
  your config.

2. Configure your keys

- Copy `.env.template` to `.env` and add your keys.

### Dependencies

```bash
yarn install
```

### Build

```bash
yarn build
```

## Interface

[API documentation](/docs/API.md)
[Graph playground](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-testnet)

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

- Example metadata schema's
- Yup validation

Wrapper for [Graph-client](https://github.com/graphprotocol/graph-client)
