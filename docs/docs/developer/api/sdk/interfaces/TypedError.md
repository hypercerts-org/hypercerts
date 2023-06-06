[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / TypedError

# Interface: TypedError

An interface for errors that have a specific type.

## Hierarchy

- `Error`

  ↳ **`TypedError`**

## Implemented by

- [`ClientError`](../classes/ClientError.md)
- [`FetchError`](../classes/FetchError.md)
- [`InvalidOrMissingError`](../classes/InvalidOrMissingError.md)
- [`MalformedDataError`](../classes/MalformedDataError.md)
- [`MintingError`](../classes/MintingError.md)
- [`StorageError`](../classes/StorageError.md)
- [`UnknownSchemaError`](../classes/UnknownSchemaError.md)
- [`UnsupportedChainError`](../classes/UnsupportedChainError.md)

## Table of contents

### Properties

- [\_\_type](TypedError.md#__type)
- [payload](TypedError.md#payload)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md)

The type of error.

#### Defined in

[sdk/src/types/errors.ts:22](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L22)

---

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[sdk/src/types/errors.ts:27](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L27)
