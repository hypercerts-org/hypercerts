[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / ClientError

# Class: ClientError

Fails fetching a remote resource

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](ClientError.md#constructor)

### Properties

- [\_\_type](ClientError.md#__type)
- [message](ClientError.md#message)
- [name](ClientError.md#name)
- [payload](ClientError.md#payload)

## Constructors

### constructor

• **new ClientError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:25](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L25)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.ClientError`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:21](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L21)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[message](../interfaces/TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:23](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L23)

---

### name

• **name**: `string` = `"ClientError"`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[name](../interfaces/TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:22](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L22)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:24](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L24)
