[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) /
ClientError

# Class: ClientError

[types/errors](../modules/types_errors.md).ClientError

Fails fetching a remote resource

## Implements

- [`TypedError`](../interfaces/types_errors.TypedError.md)

## Table of contents

### Constructors

- [constructor](types_errors.ClientError.md#constructor)

### Properties

- [\_\_type](types_errors.ClientError.md#__type)
- [message](types_errors.ClientError.md#message)
- [name](types_errors.ClientError.md#name)
- [payload](types_errors.ClientError.md#payload)

## Constructors

### constructor

• **new ClientError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:25](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L25)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.ClientError`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[\_\_type](../interfaces/types_errors.TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:21](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L21)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[message](../interfaces/types_errors.TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:23](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L23)

---

### name

• **name**: `string` = `"ClientError"`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[name](../interfaces/types_errors.TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:22](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L22)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[payload](../interfaces/types_errors.TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:24](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L24)
