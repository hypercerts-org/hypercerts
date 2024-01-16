# Errors in the SDK

Generally, we follow the pattern of throwing on errors and letting those surface to the application. This allows for developers to handle any (un)expected errors in a manner they find suitable.

### Handling Errors

To support debugging we've implemented some custom errors.

| Error                   | Description                                          | Payload                      |
| ----------------------- | ---------------------------------------------------- | ---------------------------- |
| `ClientError`           | An error that is caused by a problem with the client | `{ "key": "value" }`         |
| `ContractError`         | An error that is returned by the contract            | \`{ "data": "BaseError       |
| `FetchError`            | Fails fetching a remote resource                     | `{ "key": "value" }`         |
| `InvalidOrMissingError` | The provided value was undefined or empty            | `{ "key": "value" }`         |
| `MintingError`          | Minting transaction failed                           | `{ "key": "value" }`         |
| `StorageError`          | Fails storing to a remote resource                   | `{ "key": "value" }`         |
| `UnknownSchemaError`    | Schema could not be loaded                           | `{ "schemaName": "string" }` |
| `MalformedDataError`    | Data doesn't conform to expectations                 | `{ "key": "value" }`         |
| `UnsupportedChainError` | This blockchain is not yet supported                 | \`{ "chainID": "string       |
| `ConfigurationError`    | The configuration was invalid                        | `{ "key": "value" }`         |
