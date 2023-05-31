[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / FetchError

# Class: FetchError

Fails fetching a remote resource

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](FetchError.md#constructor)

### Properties

- [\_\_type](FetchError.md#__type)
- [message](FetchError.md#message)
- [name](FetchError.md#name)
- [payload](FetchError.md#payload)

## Constructors

### constructor

• **new FetchError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:42](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L42)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.FetchError`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:38](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L38)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[message](../interfaces/TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:40](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L40)

---

### name

• **name**: `string` = `"FetchError"`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[name](../interfaces/TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:39](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L39)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:41](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L41)
