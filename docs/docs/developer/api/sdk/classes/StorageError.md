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

[sdk/src/types/errors.ts:92](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L92)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.StorageError`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:88](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L88)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[message](../interfaces/TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:90](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L90)

---

### name

• **name**: `string` = `"StorageError"`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[name](../interfaces/TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:89](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L89)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:91](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L91)
