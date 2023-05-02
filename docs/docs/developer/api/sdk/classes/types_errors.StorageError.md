[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) / StorageError

# Class: StorageError

[types/errors](../modules/types_errors.md).StorageError

Fails storing to a remote resource

## Implements

- [`TypedError`](../interfaces/types_errors.TypedError.md)

## Table of contents

### Constructors

- [constructor](types_errors.StorageError.md#constructor)

### Properties

- [\_\_type](types_errors.StorageError.md#__type)
- [message](types_errors.StorageError.md#message)
- [name](types_errors.StorageError.md#name)
- [payload](types_errors.StorageError.md#payload)

## Constructors

### constructor

• **new StorageError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:92](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L92)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.StorageError`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[\_\_type](../interfaces/types_errors.TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:88](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L88)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[message](../interfaces/types_errors.TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:90](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L90)

---

### name

• **name**: `string` = `"StorageError"`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[name](../interfaces/types_errors.TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:89](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L89)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[payload](../interfaces/types_errors.TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:91](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L91)
