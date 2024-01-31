---
id: "index"
title: "@hypercerts-org/sdk"
sidebar_label: "Readme"
sidebar_position: 0
custom_edit_url: null
---

# Hypercert SDK

## Quickstart Guide

1. Install the SDK using npm or yarn:

```bash
npm install @hypercerts-org/sdk
```

or

```bash
 yarn add @hypercerts-org/sdk
```

2. Import the SDK into your project:

```bash
import { HypercertClient } from "@hypercerts-org/sdk";
```

3. Create a new instance of the HypercertClient class with your configuration options:

```js
const client = new HypercertClient({
  chain: { id: 11155111 }, // required
});
```

> **Note** If there's no `walletClient` provided the client will run in [read-only mode](#read-only-mode)

4. Use the client object to interact with the Hypercert network.

For example, you can use the `client.mintClaim` method to create a new claim:

```js
const tx = await client.mintClaim(
  metaData,
  totalUnits,
  transferRestriction,
  overrides,
);
```

This will validate the metadata, store it on IPFS, create a new hypercert on-chain and return a transaction receipt.

You can also use the client to query the subgraph and retrieve which claims an address owns:

```js
const claims = await client.indexer.fractionsByOwner(owner);
```

For more information on how to use the SDK, check out the
[developer documentation](https://hypercerts.org/docs/developer/) and the
[Graph playground](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-testnet).

That's it! With these simple steps, you can start using the Hypercert SDK in your own projects.

## Config

HypercertClientConfig is a configuration object used when initializing a new instance of the HypercertClient. It allows
you to customize the client by setting your own providers or deployments. At it's simplest, you only need to provide
`chain.id` to initalize the client in `readonly` mode.

| Field                       | Type    | Description                                                                                    |
| --------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `chain`                     | Object  | Partial configuration for the blockchain network.                                              |
| `contractAddress`           | String  | The address of the deployed contract.                                                          |
| `graphUrl`                  | String  | The URL to the subgraph that indexes the contract events. Override for localized testing.      |
| `graphName`                 | String  | The name of the subgraph.                                                                      |
| `easContractAddress`        | String  | The address of the EAS contract.                                                               |
| `publicClient`              | Object  | The PublicClient is inherently read-only and is used for reading data from the blockchain.     |
| `walletClient`              | Object  | The WalletClient is used for signing and sending transactions.                                 |
| `unsafeForceOverrideConfig` | Boolean | Boolean to force the use of overridden values.                                                 |
| `readOnly`                  | Boolean | Boolean to assert if the client is in read-only mode.                                          |
| `readOnlyReason`            | String  | Reason for read-only mode. This is optional and can be used for logging or debugging purposes. |

### Read-only mode

The SDK client will be in read-only mode if any of the following conditions are true:

- The client was initialized without a walletprovider.
- The contract address is not set.
- The storage layer is in read-only mode.

If any of these conditions are true, the readonly property of the HypercertClient instance will be set to true, and a
warning message will be logged indicating that the client is in read-only mode.

### Logging

The logger for the SDK uses the log level based on the value of the LOG_LEVEL environment variable. The log level
determines which log messages are printed to the console. By default, the logger is configured to log messages with a
level of info or higher to the console.

## Client modules

The `HypercertClient` provides a high-level interface for interacting with the Hypercert ecosystem. The HypercertClient
has three getter methods: `storage`, `indexer`, and `contract`. These methods return instances of the HypercertsStorage,
HypercertIndexer, and HypercertMinter classes, respectively.

```js
const {
  client: { storage },
} = new HypercertClient({ chain: { id: 11155111 } });
```

The `storage` is a utility class that provides methods for storing and retrieving Hypercert metadata from IPFS. It is
used by the HypercertClient to store metadata when creating new Hypercerts.

```js
const {
  client: { indexer },
} = new HypercertClient({ chain: { id: 11155111 } });
```

The `indexer` is a utility class that provides methods for indexing and searching Hypercerts based on various criteria.
It is used by the HypercertClient to retrieve event-based data via the subgraph

```js
const {
  client: { contract },
} = new HypercertClient({ chain: { id: 11155111 } });
```

Finally we have a `contract` that provides methods for interacting with the HypercertMinter smart contract. It is used
by the HypercertClient to create new Hypercerts and retrieve specific on-chain information.

By providing instances of these classes through the storage, indexer, and contract getters, the HypercertClient allows
developers to easily interact with the various components of the Hypercert system. For example, a developer could use
the storage instance to store metadata for a new Hypercert, the indexer instance to search for existing Hypercerts based
on various criteria, and the contract instance to create new Hypercerts and retrieve existing Hypercerts from the
contract.
