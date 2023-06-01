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

[sdk/src/types/errors.ts:106](https://github.com/Network-Goods/hypercerts/blob/1adf630/sdk/src/types/errors.ts#L106)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md) = `ErrorType.MintingError`

The type of error.

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:102](https://github.com/Network-Goods/hypercerts/blob/1adf630/sdk/src/types/errors.ts#L102)

---

### message

• **message**: `string`

#### Implementation of

TypedError.message

#### Defined in

[sdk/src/types/errors.ts:104](https://github.com/Network-Goods/hypercerts/blob/1adf630/sdk/src/types/errors.ts#L104)

---

### name

• **name**: `string` = `"MintingError"`

#### Implementation of

TypedError.name

#### Defined in

[sdk/src/types/errors.ts:103](https://github.com/Network-Goods/hypercerts/blob/1adf630/sdk/src/types/errors.ts#L103)

---

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:105](https://github.com/Network-Goods/hypercerts/blob/1adf630/sdk/src/types/errors.ts#L105)
