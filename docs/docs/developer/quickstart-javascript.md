# Getting started with JavaScript

The Hypercerts SDK makes it easy to integrate Hypercerts into your application or backend with JavaScript/TypeScript.

## Installation

Install the SDK using npm or yarn:

```bash
npm install @hypercerts-org/sdk
# OR yarn add @hypercerts-org/sdk
```

## Initialize

Import the SDK into your project and create a new instance of `HypercertClient` with your configuration options:

```js
import { HypercertClient } from "@hypercerts-org/sdk";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";

const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

// NOTE: you should replace this with your own JSON-RPC provider to the network
// This should have signing abilities and match the `chainId` passed into HypercertClient

const client = new HypercertClient({
  chainId: 11155111, // Sepolia testnet
  walletClient,
});
```

Hypercerts is a multi-chain protocol.
See [here](./supported-networks.md) for a list of currently supported networks.

> **Note** If there's no `walletClient` provided, the client will run in [read-only mode](#read-only-mode).

## Make a Hypercert

Use the client object to interact with the Hypercert network. For example, you can use the `client.mintClaim` method to create a new claim:

```js
import {
  formatHypercertData,
  TransferRestrictions,
} from "@hypercerts-org/sdk";

// Validate and format your Hypercert metadata
const { data: metadata, valid, errors } = formatHypercertData({
  name,
  ...
})

// Check on errors
if (!valid) {
  return console.error(errors);
}

// Set the total amount of units available
const totalUnits: bigint = 10000n

// Define the transfer restriction
const transferRestrictions: TransferRestrictions = TransferRestrictions.FromCreatorOnly

// Mint your Hypercert!
const tx = await client.mintClaim(
  metadata,
  totalUnits,
  transferRestrictions,
);
```

For guidance on how to specify your metadata, see the [minting guide](../minting-guide/step-by-step.md).
This will validate the metadata, store claim metadata on IPFS, create a new hypercert on-chain, and return a transaction receipt.

For more details, check out the [Minting Guide](./minting.md).

## Query for Hypercerts

You can also use the client to query the subgraph and retrieve which claims an address owns:

```js
const claims = await client.indexer.fractionsByOwner(owner),
```

For more details, checkout the [Querying guide](./querying.md)
and our [Graph playground](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-optimism-mainnet).

That's it! With these simple steps, you can start using the Hypercert SDK in your own projects.
