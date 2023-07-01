# Errors in the SDK

Generally, we follow the pattern of throwing on errors and letting those surface to the application. This allows for developers to handle any (un)expected errors in a manner they find suitable.

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
