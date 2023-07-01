# Getting started with JavaScript

The Hypercerts SDK makes it easy to integrate Hypercerts into your application or backend with JavaScript/TypeScript.

## Quickstart

### Installation

Install the SDK using npm or yarn:

```bash
npm install @hypercerts-org/sdk
# OR yarn add @hypercerts-org/sdk
```

### Get storage credentials (only required for minting)

For now, we store all metadata (e.g. Hypercert claim data) on IPFS using [NFT.Storage](https://nft.storage/) and [web3.storage](https://web3.storage/).

In order to mint a Hypercert, you will need to create API tokens for both services, which you can learn more about from their respective guides:

- [Get an NFT.Storage API token](https://nft.storage/docs/#get-an-api-token)
- [Get a web3.storage API token](https://web3.storage/docs/how-tos/generate-api-token/)

In the future, we want to also support other mechanisms for storing off-chain data.

### Initialize

Import the SDK into your project and create a new instance of `HypercertClient` with your configuration options:

```js
import { HypercertClient } from "@hypercerts-org/sdk";
import { ethers } from "ethers";

// NOTE: you should replace this with your own JSON-RPC provider to the network
// This should have signing abilities and match the `chainId` passed into HypercertClient
const operator = ethers.providers.getDefaultProvider("goerli");

const client = new HypercertClient({
  chainId: 5,
  operator,
  nftStorageToken,
  web3StorageToken,
});
```

> **Note** If there's no `operator`, `nftStorageToken` or `web3StorageToken` provided, the client will run in [read-only mode](#read-only-mode).

### Make a Hypercert

Use the client object to interact with the Hypercert network. For example, you can use the `client.mintClaim` method to create a new claim:

```js
import {
  formatHypercertData,
  TransferRestrictions,
} from "@hypercerts-org/sdk";

// Format your Hypercert metadata
const { data: metadata, valid, errors } = formatHypercertData({
  name,
  ...
})

if (!valid) {
  return console.error(errors);
}

// Set the total amount of units available
const totalUnits: BigNumberish = 10_000_000

// Define the transfer restriction
const transferRestrictions: TransferRestrictions = TransferRestrictions.FromCreatorOnly

// Mint your Hypercert!
const tx = await client.mintClaim(
  metadata,
  totalUnits,
  transferRestrictions,
);
```

This will validate the metadata, store it on IPFS, create a new hypercert on-chain and return a transaction receipt.

For more details, check out the [Minting Guide](./minting.md).

### Query for Hypercerts

You can also use the client to query the subgraph and retrieve which claims an address owns:

```js
const claims = await client.indexer.fractionsByOwner(owner),
```

For more details, checkout the [Querying guide](./querying.md)
and our [Graph playground](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-optimism-mainnet).

That's it! With these simple steps, you can start using the Hypercert SDK in your own projects.

## Client modules

The `HypercertClient` provides a high-level interface for interacting with the Hypercert ecosystem. The HypercertClient
has three getter methods: `storage`, `indexer`, and `contract`. These methods return instances of the HypercertsStorage,
HypercertIndexer, and HypercertMinter classes, respectively.

```js
const {
  client: { storage },
} = new HypercertClient({});
```

The `storage` is a utility class that provides methods for storing and retrieving Hypercert metadata on IPFS and
NFT.storage. It is used by the HypercertClient to store metadata when creating new Hypercerts.

```js
const {
  client: { indexer },
} = new HypercertClient({});
```

The `indexer` is a utility class that provides methods for indexing and searching Hypercerts based on various criteria.
It is used by the HypercertClient to retrieve event-based data via the subgraph

```js
const {
  client: { contract },
} = new HypercertClient({});
```

Finally we have a `contract` that provides methods for interacting with the HypercertMinter smart contract. It is used
by the HypercertClient to create new Hypercerts and retrieve specific on-chain information.

By providing instances of these classes through the storage, indexer, and contract getters, the HypercertClient allows
developers to easily interact with the various components of the Hypercert system. For example, a developer could use
the storage instance to store metadata for a new Hypercert, the indexer instance to search for existing Hypercerts based
on various criteria, and the contract instance to create new Hypercerts and retrieve existing Hypercerts from the
contract.
