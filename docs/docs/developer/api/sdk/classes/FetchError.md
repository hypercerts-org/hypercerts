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

[sdk/src/types/errors.ts:73](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L73)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md) = `ErrorType.FetchError`

The type of error.

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:69](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L69)

---

### message

• **message**: `string`

#### Implementation of

TypedError.message

#### Defined in

[sdk/src/types/errors.ts:71](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L71)

---

### name

• **name**: `string` = `"FetchError"`

#### Implementation of

TypedError.name

#### Defined in

[sdk/src/types/errors.ts:70](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L70)

---

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:72](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L72)
