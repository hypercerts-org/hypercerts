# Getting started with JavaScript

or TypeScript

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
  chainId: 5,
});
```

Use the client object to interact with the Hypercert network. For example, you can use the `client.mintClaim` method to
create a new claim:

```js
const tx = await client.mintClaim(
  metaData,
  totalUnits,
  transferRestriction,
  overrides,
);
```

This will validate the metadata, store it on IPFS, create a new hypercert on-chain and return a transaction receipt.

For more information on how to use the SDK, check out the
[developer documentation](https://hypercerts.org/docs/developer/) and the
[Graph playground](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-testnet).

That's it! With these simple steps, you can start using the Hypercert SDK in your own projects. Don't forget to set your
environment variables for your NFT.storage and web3.storage API keys in your .env file.

## Config

The SDK will try to determine the `DEFAULT_CHAIN_ID` and use that to inform the configuration. We allow for `overrides`
when creating the SDK by passing configuration variables. Finally, when not defaults or overrides are found, we check
the environment variables.

### Read-only mode

The SDK client will be in read-only mode if any of the following conditions are true:

- The client was initialized without a signer or provider.
- The client was initialized with a provider but not a signer.
- The client was initialized with a signer but not a provider.
- The contract address is not set.
- The storage layer is in read-only mode.

If any of these conditions are true, the readonly property of the HypercertClient instance will be set to true, and a
warning message will be logged indicating that the client is in read-only mode.

### Defaults

The constants.ts file defines various constants that are used throughout the Hypercert system. Here's a brief
explanation of each constant:

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

### Client config properties

| \| Property        | Type                 | Description                            |
| ------------------ | -------------------- | -------------------------------------- |
| `chainId`          | `number`             | The chain ID of the network to use.    |
| `chainName`        | `string`             | The name of the network to use.        |
| `contractAddress`  | `string`             | The address of the Hypercert contract. |
| `rpcUrl`           | `string`             | The URL of the RPC endpoint to use.    |
| `graphName`        | `string`             | The name of the Gsubgraph to use.      |
| `provider`         | `providers.Provider` | A custom Ethereum provider to use.     |
| `signer`           | `Signer`             | A custom Ethereum signer to use.       |
| `nftStorageToken`  | `string`             | Your NFT.storage API key.              |
| `web3StorageToken` | `string`             | Your web3.storage API key.             |

### Environment variables

To determine the missing configuration values the SDK defaults to the following environment variables:

| Environment Variable             | Description                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `DEFAULT_CHAIN_ID`               | Specifies the default chain ID to use if no chain ID is specified.                                  |
| `CONTRACT_ADDRESS`               | Specifies the contract address to use for the Hypercert system.                                     |
| `RPC_URL`                        | Specifies the RPC URL to use for the Ethereum network.                                              |
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

### Minting you first hypercert

[code](https://github.com/hypercerts-org/hypercerts/tree/main/sdk/src/client.ts)

To mint a hypercert you need to provide the `metadata`, total amount of `units` and the prefered `TransferRestrictions`.

```js
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk"

const { metadata } = formatHypercertData(...);
const totalUnits = "10000";

const tx: Promise<ContractTransaction> = await hypercerts.mintClaim({
  metadata,
  totalUnits
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});

```

### Create an allowlist

Allowlists are an efficient way to enable distribution of hypercert fractions amongst a group of funders/contributors.

```js
import { TransferRestrictions, formatHypercertData, Allowlist } from "@hypercerts-org/sdk"

const allowlist: Allowlist = [
  { address: "0x123", units: 100},
  { address: "0xabc", units: 100}
];
const { metadata } = formatHypercertData(...);
const totalUnits = "10000";

const { claimId } = await hypercerts.createAllowlist({
  allowList,
  metaData,
  totalUnits,
  transferRestrictions: TransferRestrictions.FromCreatorOnly,
});
```

#### Claiming a fraction token

```js
const { tokenId } = await hypercerts.mintFromAllowlist({
  claimIds: [claimId1, claimId2],
});
```

### Split / merge token values

```js
const { tokenIds } = await hypercerts.splitFraction({
  tokenId,
  units: [10, 12, 15],
});
const { tokenId } = await hypercerts.mergeFractions({ tokenIds });
```

### Split / merge claim data

```js
const { claimIds } = await hypercerts.splitClaim({
  claimId,
  TODO: somehow specify hypercert subregions
});
const { claimId} = await hypercerts.mergeClaims({
  claimIds,
});
```

### Burning fraction tokens

```js
const { TODO } = await hypercerts.burnFraction({ tokenId });
```

### Create an evaluation

Perhaps leverage EAS schema registry to generate different types of evaluation schemas
(e.g. different type of eval for OSS vs SP Audits vs Climate)

```js
const { TODO } = await hypercerts.createEvaluation({
  ref: HypercertClaim || HypercertRegion || Evaluation
  evaluationSchema: "SCHEMA_IDENTIFIER"
  data: TODO
});
```

### Respond / or contest an evaluation

Just create an evaluation referencing an evaluation

```js

```

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

### Progress reporting

```js
const promise = hypercerts.mintClaim(...);
// TODO see contract-interaction-dialog-context.tsx
const steps = promise.getSteps();
/**
 * [
 *  { key: "step1", description: "" }
 *  { key: "step2", description: "" }
 * ]
 **/
promise.onStep(stepKey => {...});
promise.onProgress(percent => {...});
const { claimId } = await promise;
```

## Query operations

### Claims

```js
const { TODO } = await hypercerts.claimsByOwner({ owner });
```

### Fraction tokens

```js
const { TODO } = await hypercerts.fractionsByOwner({ owner });
```
