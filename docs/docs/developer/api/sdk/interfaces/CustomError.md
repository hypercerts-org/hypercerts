---
id: "CustomError"
title: "Interface: CustomError"
sidebar_label: "CustomError"
sidebar_position: 0
custom_edit_url: null
---

An interface for errors that have a specific type.

## Implemented by

- [`ClientError`](../classes/ClientError.md)
- [`ConfigurationError`](../classes/ConfigurationError.md)
- [`ContractError`](../classes/ContractError.md)
- [`FetchError`](../classes/FetchError.md)
- [`InvalidOrMissingError`](../classes/InvalidOrMissingError.md)
- [`MalformedDataError`](../classes/MalformedDataError.md)
- [`MintingError`](../classes/MintingError.md)
- [`StorageError`](../classes/StorageError.md)
- [`UnknownSchemaError`](../classes/UnknownSchemaError.md)
- [`UnsupportedChainError`](../classes/UnsupportedChainError.md)

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[sdk/src/types/errors.ts:10](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/errors.ts#L10)
