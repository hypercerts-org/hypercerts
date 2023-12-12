# Hypercert Client Configuration

The client provides a high level interface that communicates with the Graph, IPFS and the evm. For easy setup we harmonised the configuration into a flow that allows for configuration with different levels of specificity.

## Configuration

### Setup

The SDK allows for minimal configuration, explicit overrides and defining values in environment variables. We apply the following hierarchy:

1. Overrides declared in `Partial<HypercertClientConfig>`

Based on the chainID (either 5 or 10) we load the default config for Goerli or Optimism.

We then process the rest of the overrides and possible environment variables to customise the default configuration.

To get started quickly you can either:

- initialize a new client by calling `new HypercertClient({chain: {id: 5})` (or 10)

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

`DEPLOYMENTS`: This constant defines the deployments that are managed by the Hypercert system. Each Deployment object
contains information about a specific deployment, including the chain ID, chain name, contract address, and graph name.

For example:

```json
{
  "5": {
    "contractAddress": "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    "graphName": "hypercerts-testnet",
    "graphUrl": "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet"
  }
}
```

You can select which deployment to use by passing in a `chainId` configuration parameter. We also allow for `overrides`
when creating the SDK by passing configuration variables.

### Client config properties

HypercertClientConfig is a configuration object used when initializing a new instance of the HypercertClient. It allows
you to customize the client by setting your own providers or deployments. At it's simplest, you only need to provide
`chain.id` to initalize the client in `readonly` mode.

| Field                       | Type    | Description                                                                                    |
| --------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `chain`                     | Object  | Partial configuration for the blockchain network.                                              |
| `contractAddress`           | String  | The address of the deployed contract.                                                          |
| `graphUrl`                  | String  | The URL to the subgraph that indexes the contract events. Override for localized testing.      |
| `graphName`                 | String  | The name of the subgraph.                                                                      |
| `nftStorageToken`           | String  | The API token for NFT.storage.                                                                 |
| `web3StorageToken`          | String  | The API token for Web3.storage.                                                                |
| `easContractAddress`        | String  | The address of the EAS contract.                                                               |
| `publicClient`              | Object  | The PublicClient is inherently read-only and is used for reading data from the blockchain.     |
| `walletClient`              | Object  | The WalletClient is used for signing and sending transactions.                                 |
| `unsafeForceOverrideConfig` | Boolean | Boolean to force the use of overridden values.                                                 |
| `readOnly`                  | Boolean | Boolean to assert if the client is in read-only mode.                                          |
| `readOnlyReason`            | String  | Reason for read-only mode. This is optional and can be used for logging or debugging purposes. |

- [Get an NFT.Storage API token](https://nft.storage/docs/#get-an-api-token)
- [Get a web3.storage API token](https://web3.storage/docs/how-tos/generate-api-token/)

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
