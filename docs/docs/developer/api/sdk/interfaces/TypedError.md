[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / TypedError

# Interface: TypedError

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
- [message](TypedError.md#message)
- [name](TypedError.md#name)
- [payload](TypedError.md#payload)
- [stack](TypedError.md#stack)

## Properties

### \_\_type

• **\_\_type**: `ErrorType`

#### Defined in

[sdk/src/types/errors.ts:13](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L13)

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

[sdk/src/types/errors.ts:14](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L14)

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055
