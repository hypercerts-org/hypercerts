[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / MintingError

# Class: MintingError

Minting transaction failed

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](MintingError.md#constructor)

### Properties

- [\_\_type](MintingError.md#__type)
- [message](MintingError.md#message)
- [name](MintingError.md#name)
- [payload](MintingError.md#payload)

## Constructors

### constructor

• **new MintingError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Defined in

[sdk/src/types/errors.ts:75](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L75)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.MintingError`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:71](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L71)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[message](../interfaces/TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:73](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L73)

---

### name

• **name**: `string` = `"MintingError"`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[name](../interfaces/TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:72](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L72)

---

### payload

• `Optional` **payload**: `Object`

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:74](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L74)
