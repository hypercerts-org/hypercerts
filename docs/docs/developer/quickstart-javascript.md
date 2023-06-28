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

// Mint your Hypercert!
const tx = await client.mintClaim(
  metadata,
  totalUnits,
  TransferRestrictions.FromCreatorOnly,
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

## Configuration

### Read-only mode

The SDK client will be in read-only mode if any of the following conditions are true:

- The client was initialized without an operator.
- The client was initialized with an operator without signing abilities.
- The contract address is not set.
- The storage layer is in read-only mode.

If any of these conditions are true, the read-only property of the `HypercertClient` instance will be set to true, and a warning message will be logged indicating that the client is in read-only mode.

### Defaults

The [constants.ts](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/constants.ts) file defines various defaults constants that are used throughout the Hypercert system.

`DEFAULT_CHAIN_ID`: This constant defines the default chain ID to use if no chain ID is specified. In this case, the
default chain ID is set to 5, which corresponds to the Goerli testnet.

Based on `DEFAULT_CHAIN_ID` the SDK will select a `DEPLOYMENT`.

`DEPLOYMENTS`: This constant defines the deployments that are managed by the Hypercert system. Each Deployment object
contains information about a specific deployment, including the chain ID, chain name, contract address, and graph name.

For example:

```json
{
  "5": {
    "chainId": 5,
    "chainName": "goerli",
    "contractAddress": "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    "graphName": "hypercerts-testnet"
  }
}
```

You can select which deployment to use by either passing in a `chainId` configuration parameter or setting the `DEFAULT_CHAIN_ID` environment variable. We allow for `overrides`
when creating the SDK by passing configuration variables. Finally, when not defaults or overrides are found, we check the environment variables.

### Client config properties

| \| Property        | Type                 | Description                            |
| ------------------ | -------------------- | -------------------------------------- |
| `chainId`          | `number`             | The chain ID of the network to use.    |
| `chainName`        | `string`             | The name of the network to use.        |
| `contractAddress`  | `string`             | The address of the Hypercert contract. |
| `rpcUrl`           | `string`             | The URL of the RPC endpoint to use.    |
| `graphName`        | `string`             | The name of the Gsubgraph to use.      |
| `provider`         | `providers.Provider` | A custom provider to use.              |
| `signer`           | `Signer`             | A custom signer to use.                |
| `nftStorageToken`  | `string`             | Your NFT.storage API key.              |
| `web3StorageToken` | `string`             | Your web3.storage API key.             |

### Environment variables

You can also configure the SDK via environment variables. If you set both the config parameter and environment variable, the config parameter will take precedent.

| Environment Variable             | Description                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `DEFAULT_CHAIN_ID`               | Specifies the default chain ID to use if no chain ID is specified.                                  |
| `CONTRACT_ADDRESS`               | Specifies the contract address to use for the Hypercert protocol.                                   |
| `RPC_URL`                        | Specifies the RPC URL to use for the evm-compatible network.                                        |
| `PRIVATE_KEY`                    | Specifies the private key to use for signing transactions.                                          |
| `NFT_STORAGE_TOKEN`              | Specifies the NFT.storage API token to use for storing Hypercert metadata.                          |
| `NEXT_PUBLIC_NFT_STORAGE_TOKEN`  | Specifies the NFT.storage API token to use for storing Hypercert metadata in a Next.js application. |
| `WEB3_STORAGE_TOKEN`             | Specifies the Web3.storage API token to use for storing Hypercert data.                             |
| `NEXT_PUBLIC_WEB3_STORAGE_TOKEN` | Specifies the Web3.storage API token to use for storing Hypercert data in a Next.js application.    |

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

### Handling Errors

To support debugging we've implemented some custom errors.

```js
export interface TypedError extends Error {
  __type: ErrorType;
  payload?: { [key: string]: unknown };
}
```

| Error                 | Reason                             | Payload                                         |
| --------------------- | ---------------------------------- | ----------------------------------------------- |
| FetchError            | Async call to API failed           | `{ [key: string]: unknown }`                    |
| InvalidOrMissingError | Env var missing                    | `{ keyName: string }`                           |
| MalformedDataError    | Validation or formatting failed    | `{ [key: string]: unknown }`                    |
| MintingError          | EVM call to mint failed            | `{ [key: string]: unknown }`                    |
| StorageError          | NFT-/Web3 Storage error            | `{ [key: string]: unknown }`                    |
| UnsupportedChainError | Provided EVM chainID not supported | <code>{ chainID: string &#124; number };</code> |
| UnknownSchemaError    | Validation schema not found        | `{ schemaName: string }`                        |
