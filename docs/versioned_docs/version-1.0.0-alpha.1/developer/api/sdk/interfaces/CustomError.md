[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / CustomError

# Interface: CustomError

An interface for errors that have a specific type.

## Implemented by

- [`ClientError`](../classes/ClientError.md)
- [`ConfigurationError`](../classes/ConfigurationError.md)
- [`FetchError`](../classes/FetchError.md)
- [`InvalidOrMissingError`](../classes/InvalidOrMissingError.md)
- [`MalformedDataError`](../classes/MalformedDataError.md)
- [`MintingError`](../classes/MintingError.md)
- [`StorageError`](../classes/StorageError.md)
- [`UnknownSchemaError`](../classes/UnknownSchemaError.md)
- [`UnsupportedChainError`](../classes/UnsupportedChainError.md)

## Table of contents

### Properties

- [payload](CustomError.md#payload)

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[sdk/src/types/errors.ts:8](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L8)
