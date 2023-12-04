# Errors in the SDK

Generally, we follow the pattern of throwing on errors and letting those surface to the application. This allows for developers to handle any (un)expected errors in a manner they find suitable.

### Handling Errors

To support debugging we've implemented some custom errors.

| Error                 | Reason                                            | Payload                      |
| --------------------- | ------------------------------------------------- | ---------------------------- | --------- |
| ClientError           | An error caused by the client                     | `{ [key: string]: unknown }` |
| FetchError            | An error caused by a failed API call              | `{ [key: string]: unknown }` |
| InvalidOrMissingError | An error caused by a missing environment variable | `{ keyName: string }`        |
| MalformedDataError    | An error caused by invalid or malformed data      | `{ [key: string]: unknown }` |
| MintingError          | An error caused by a failed EVM call to mint      | `{ [key: string]: unknown }` |
| StorageError          | An error caused by NFT-/Web3 Storage              | `{ [key: string]: unknown }` |
| UnsupportedChainError | An error caused by an unsupported EVM chain ID    | `{ chainID: string           | number }` |
| UnknownSchemaError    | An error caused by a missing validation schema    | `{ schemaName: string }`     |
