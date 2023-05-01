[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) /
TypedError

# Interface: TypedError

[types/errors](../modules/types_errors.md).TypedError

## Hierarchy

- `Error`

  ↳ **`TypedError`**

## Implemented by

- [`ClientError`](../classes/types_errors.ClientError.md)
- [`FetchError`](../classes/types_errors.FetchError.md)
- [`InvalidOrMissingError`](../classes/types_errors.InvalidOrMissingError.md)
- [`MalformedDataError`](../classes/types_errors.MalformedDataError.md)
- [`MintingError`](../classes/types_errors.MintingError.md)
- [`StorageError`](../classes/types_errors.StorageError.md)
- [`UnknownSchemaError`](../classes/types_errors.UnknownSchemaError.md)
- [`UnsupportedChainError`](../classes/types_errors.UnsupportedChainError.md)

## Table of contents

### Properties

- [\_\_type](types_errors.TypedError.md#__type)
- [message](types_errors.TypedError.md#message)
- [name](types_errors.TypedError.md#name)
- [payload](types_errors.TypedError.md#payload)
- [stack](types_errors.TypedError.md#stack)

## Properties

### \_\_type

• **\_\_type**: `ErrorType`

#### Defined in

[sdk/src/types/errors.ts:13](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L13)

---

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

---

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Defined in

[sdk/src/types/errors.ts:14](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L14)

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055
