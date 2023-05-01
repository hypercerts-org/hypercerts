[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) /
MintingError

# Class: MintingError

[types/errors](../modules/types_errors.md).MintingError

Minting transaction failed

## Implements

- [`TypedError`](../interfaces/types_errors.TypedError.md)

## Table of contents

### Constructors

- [constructor](types_errors.MintingError.md#constructor)

### Properties

- [\_\_type](types_errors.MintingError.md#__type)
- [message](types_errors.MintingError.md#message)
- [name](types_errors.MintingError.md#name)
- [payload](types_errors.MintingError.md#payload)

## Constructors

### constructor

• **new MintingError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:75](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L75)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.MintingError`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[\_\_type](../interfaces/types_errors.TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:71](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L71)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[message](../interfaces/types_errors.TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:73](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L73)

---

### name

• **name**: `string` = `"MintingError"`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[name](../interfaces/types_errors.TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:72](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L72)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[payload](../interfaces/types_errors.TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:74](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L74)
