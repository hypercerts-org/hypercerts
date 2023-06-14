[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / StorageError

# Class: StorageError

Fails storing to a remote resource

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](StorageError.md#constructor)

### Properties

- [\_\_type](StorageError.md#__type)
- [message](StorageError.md#message)
- [name](StorageError.md#name)
- [payload](StorageError.md#payload)

## Constructors

### constructor

• **new StorageError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:123](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L123)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md) = `ErrorType.StorageError`

The type of error.

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:119](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L119)

---

### message

• **message**: `string`

#### Implementation of

TypedError.message

#### Defined in

[sdk/src/types/errors.ts:121](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L121)

---

### name

• **name**: `string` = `"StorageError"`

#### Implementation of

TypedError.name

#### Defined in

[sdk/src/types/errors.ts:120](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L120)

---

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:122](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L122)
