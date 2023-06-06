[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / MalformedDataError

# Class: MalformedDataError

Data doesn't conform to expectations

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](MalformedDataError.md#constructor)

### Properties

- [\_\_type](MalformedDataError.md#__type)
- [message](MalformedDataError.md#message)
- [name](MalformedDataError.md#name)
- [payload](MalformedDataError.md#payload)

## Constructors

### constructor

• **new MalformedDataError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:157](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L157)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md) = `ErrorType.MalformedDataError`

The type of error.

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:153](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L153)

---

### message

• **message**: `string`

#### Implementation of

TypedError.message

#### Defined in

[sdk/src/types/errors.ts:155](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L155)

---

### name

• **name**: `string` = `"MalformedDataError"`

#### Implementation of

TypedError.name

#### Defined in

[sdk/src/types/errors.ts:154](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L154)

---

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:156](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L156)
