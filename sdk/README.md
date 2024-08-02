# Hypercert SDK

## Quickstart Guide

1. Install the SDK using npm or yarn:

```bash
pnpm install @hypercerts-org/sdk
```

or

```bash
 pnpm add @hypercerts-org/sdk
```

2. Import the SDK into your project:

```bash
import { HypercertClient } from "@hypercerts-org/sdk";
```

3. Create a new instance of the HypercertClient class with your configuration options:

```js
const client = new HypercertClient({
  environment: "test",
  walletClient, // optional, client will default to read-only mode if not provided
  publicClient, // optional, can be infered from walletClient if present
});
```

> **Note** If there's no `walletClient` provided the client will run in [read-only mode](#read-only-mode)

4. Use the client object to interact with the Hypercert network.

For example, you can use the `client.mintClaim` method to create a new claim:

```ts
const hash = await client.mintHypercert({
  metaData: { ... },
  totalUnits: 1000n,
  transferRestriction: TransferRestrictions.AllowAll,
});
```

This will validate the metadata, store it on IPFS, create a new hypercert on-chain and return a transaction receipt.

For more information on how to use the SDK, check out the
[developer documentation](https://hypercerts.org/docs/developer/) and the
[Graph playground](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-testnet).

That's it! With these simple steps, you can start using the Hypercert SDK in your own projects.

## Config

HypercertClientConfig is a configuration object used when initializing a new instance of the HypercertClient. It allows
you to customize the client by setting your own providers or deployments. At it's simplest, you only need to provide
`chain.id` to initalize the client in `readonly` mode.

| Field          | Type                     | Description                                                                                  |
| -------------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| `environment`  | `'test' \| 'production'` | Defines the environment the client will connect with.                                        |
| `deployments`  | Object                   | The deployments of the contracts on various networks.                                        |
| `readOnly`     | Boolean                  | Boolean to assert if the client is in read-only mode.                                        |
| `graphUrl`     | String                   | The URL of the graph endpoint.                                                               |
| `publicClient` | Object                   | The `PublicClient` is inherently read-only and is used for reading data from the blockchain. |
| `walletClient` | Object                   | The `WalletClient` is used for signing and sending transactions.                             |

### Read-only mode

The SDK client will be in read-only mode if any of the following conditions are true:

- The client was initialized without a wallet client.
- The client was initialized with a wallet client connected to a chain that is not supported in the environment.

### Logging

The logger for the SDK uses the log level based on the value of the LOG_LEVEL environment variable. The log level
determines which log messages are printed to the console. By default, the logger is configured to log messages with a
level of info or higher to the console.

## Modules

### Storage

The `storage` module is an utility service for easy access to the hypercerts API. It's built based on the OpenAPI spec
exposed by the hypercerts API.

```js
 const client = new HypercertClient({
  environment: "test",
  walletClient, // optional, client will default to read-only mode if not provided
  publicClient, // optional, can be infered from walletClient if present
});

const storage = client.storage;

const storageRequest = { metadata: {...}}
const storageResponse = await client.storage.storeMetadata(storageRequest);
```
