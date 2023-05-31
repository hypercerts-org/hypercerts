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

[sdk/src/types/errors.ts:126](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L126)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.MalformedDataError`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:122](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L122)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[message](../interfaces/TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:124](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L124)

---

### name

• **name**: `string` = `"MalformedDataError"`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[name](../interfaces/TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:123](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L123)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:125](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L125)
