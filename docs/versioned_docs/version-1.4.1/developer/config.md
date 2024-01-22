# Hypercert Client Configuration

The client provides a high level interface that communicates with the Graph, IPFS and the evm. For easy setup we harmonised the configuration into a flow that allows for configuration with different levels of specificity.

## Configuration

### Setup

The SDK allows for minimal configuration, explicit overrides and defining values in environment variables. We apply the following hierarchy:

1. Overrides declared in `Partial<HypercertClientConfig>`

Based on the chainID we load the default config for the respected chain, if it's supported.

We then process the rest of the overrides and possible environment variables to customise the default configuration.

To get started quickly you can either:

- initialize a new client by calling `new HypercertClient({chain: {id: 11155111})`.

Using either of the options above will launch the client in `read only` mode using the defaults in [constants.ts](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/constants.ts)

### Read-only mode

The SDK client will be in read-only mode if any of the following conditions are true:

- The client was initialized without an operator.
- The client was initialized with an operator without signing abilities.
- The contract address is not set.

If any of these conditions are true, the read-only property of the `HypercertClient` instance will be set to true, and a warning message will be logged indicating that the client is in read-only mode.

### Defaults

The [constants.ts](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/constants.ts) file defines various defaults constants that are used throughout the Hypercert system.

`DEPLOYMENTS`: This constant defines the deployments that are managed by the Hypercert system. Each Deployment object
contains information about a specific deployment, including the chain ID, chain name, contract address, and graph name.

For example:

```json
{
  "11155111": {
    "addresses": {
      "HypercertMinterUUPS": "0x1234567890abcdef1234567890abcdef12345678",
      "TransferManager": "0x1234567890abcdef1234567890abcdef12345678",
      "...": "...",
      "StrategyHypercertFractionOffer": "0x1234567890abcdef1234567890abcdef12345678"
    },
    "graphName": "hypercerts-sepola",
    "graphUrl": "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-sepolia"
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
| `easContractAddress`        | String  | The address of the EAS contract.                                                               |
| `publicClient`              | Object  | The PublicClient is inherently read-only and is used for reading data from the blockchain.     |
| `walletClient`              | Object  | The WalletClient is used for signing and sending transactions.                                 |
| `unsafeForceOverrideConfig` | Boolean | Boolean to force the use of overridden values.                                                 |
| `readOnly`                  | Boolean | Boolean to assert if the client is in read-only mode.                                          |
| `readOnlyReason`            | String  | Reason for read-only mode. This is optional and can be used for logging or debugging purposes. |

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
