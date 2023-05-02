[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) / MalformedDataError

# Class: MalformedDataError

[types/errors](../modules/types_errors.md).MalformedDataError

Data doesn't conform to expectations

## Implements

- [`TypedError`](../interfaces/types_errors.TypedError.md)

## Table of contents

### Constructors

- [constructor](types_errors.MalformedDataError.md#constructor)

### Properties

- [\_\_type](types_errors.MalformedDataError.md#__type)
- [message](types_errors.MalformedDataError.md#message)
- [name](types_errors.MalformedDataError.md#name)
- [payload](types_errors.MalformedDataError.md#payload)

## Constructors

### constructor

• **new MalformedDataError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:126](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L126)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.MalformedDataError`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[\_\_type](../interfaces/types_errors.TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:122](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L122)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[message](../interfaces/types_errors.TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:124](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L124)

---

### name

• **name**: `string` = `"MalformedDataError"`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[name](../interfaces/types_errors.TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:123](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L123)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[payload](../interfaces/types_errors.TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:125](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L125)
