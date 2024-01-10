# Hypercert Client Configuration

The client provides a high level interface that communicates with the Graph, IPFS and the evm. For easy setup we harmonised the configuration into a flow that allows for configuration with different levels of specificity.

## Configuration

### Setup

The SDK allows for minimal configuration, explicit overrides and defining values in environment variables. We apply the following hierarchy:

1. Overrides declared in `Partial<HypercertClientConfig>`
2. Environment variables exposed via `process.env`

Based on the chainID (either 5 or 10) we load the default config for Goerli or Optimism.

We then process the rest of the overrides and possible environment variables to customise the default configuration.

To get started quickly you can either:

- set `process.env.DEFAULT_CHAIN_ID` to 5 or 10
- initialize a new client by calling `new HypercertClient({chainId: 5})` (or 10)

Using either of the options above will launch the client in `read only` mode using the defaults in [constants.ts](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/constants.ts)

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
    "graphUrl": "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet"
  }
}
```

You can select which deployment to use by either passing in a `chainId` configuration parameter or setting the `DEFAULT_CHAIN_ID` environment variable. We also allow for `overrides`
when creating the SDK by passing configuration variables. Finally, when not defaults or overrides are found, we check the environment variables.

### Client config properties

| Property           | Type                       | Description                            |
| ------------------ | -------------------------- | -------------------------------------- | ------------------------------ |
| `chainId`          | `number`                   | The chain ID of the network to use.    |
| `chainName`        | `string`                   | The name of the network to use.        |
| `contractAddress`  | `string`                   | The address of the Hypercert contract. |
| `graphUrl`         | `string`                   | The url of the subgraph to use.        |
| `operator`         | `ethers.providers.Provider | ethers.Signer`                         | The provider or signer to use. |
| `nftStorageToken`  | `string`                   | Your NFT.storage API key.              |
| `web3StorageToken` | `string`                   | Your web3.storage API key.             |

- [Get an NFT.Storage API token](https://nft.storage/docs/#get-an-api-token)
- [Get a web3.storage API token](https://web3.storage/docs/how-tos/generate-api-token/)

### Environment variables

You can also configure the SDK via environment variables. If you set both the config parameter and environment variable, the config parameter will take precedent.

We provide a [template file](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/.env.template) in our monorepo.

| Environment Variable             | Description                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `DEFAULT_CHAIN_ID`               | Specifies the default chain ID to use if no chain ID is specified.                                  |
| `CONTRACT_ADDRESS`               | Specifies the contract address to use for the Hypercert protocol.                                   |
| `PRIVATE_KEY`                    | Specifies the private key to use for signing transactions.                                          |
| `NFT_STORAGE_TOKEN`              | Specifies the NFT.storage API token to use for storing Hypercert metadata.                          |
| `NEXT_PUBLIC_NFT_STORAGE_TOKEN`  | Specifies the NFT.storage API token to use for storing Hypercert metadata in a Next.js application. |
| `WEB3_STORAGE_TOKEN`             | Specifies the Web3.storage API token to use for storing Hypercert data.                             |
| `NEXT_PUBLIC_WEB3_STORAGE_TOKEN` | Specifies the Web3.storage API token to use for storing Hypercert data in a Next.js application.    |

### Logging

The logger for the SDK uses the log level based on the value of the LOG_LEVEL environment variable. The log level
determines which log messages are printed to the console. By default, the logger is configured to log messages with a
level of info or higher to the console.

In your `.env` file:

```bash
LOG_LEVEL="info"
```

The SDK logger supports four log levels: `error`, `warn`, `info`, and `debug`.

- The `error` log level is used to log errors that occur in the SDK.
- The `warn` log level is used to log warnings that do not necessarily indicate an error, but may be important to investigate.
- The `info` log level is used to log general information about the SDK's state or behavior.
- The `debug` log level is used to log detailed information that is useful for debugging purposes.
