[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) / FetchError

# Class: FetchError

[types/errors](../modules/types_errors.md).FetchError

Fails fetching a remote resource

## Implements

- [`TypedError`](../interfaces/types_errors.TypedError.md)

## Table of contents

### Constructors

- [constructor](types_errors.FetchError.md#constructor)

### Properties

- [\_\_type](types_errors.FetchError.md#__type)
- [message](types_errors.FetchError.md#message)
- [name](types_errors.FetchError.md#name)
- [payload](types_errors.FetchError.md#payload)

## Constructors

### constructor

• **new FetchError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:42](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L42)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.FetchError`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[\_\_type](../interfaces/types_errors.TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:38](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L38)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[message](../interfaces/types_errors.TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:40](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L40)

---

### name

• **name**: `string` = `"FetchError"`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[name](../interfaces/types_errors.TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:39](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L39)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[payload](../interfaces/types_errors.TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:41](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L41)
