[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / UnsupportedChainError

# Class: UnsupportedChainError

This blockchain is not yet supported
Please file an issue

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](UnsupportedChainError.md#constructor)

### Properties

- [\_\_type](UnsupportedChainError.md#__type)
- [message](UnsupportedChainError.md#message)
- [name](UnsupportedChainError.md#name)
- [payload](UnsupportedChainError.md#payload)

## Constructors

### constructor

• **new UnsupportedChainError**(`message`, `chainID`)

#### Parameters

| Name      | Type                 |
| :-------- | :------------------- |
| `message` | `string`             |
| `chainID` | `string` \| `number` |

#### Defined in

[sdk/src/types/errors.ts:175](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L175)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md) = `ErrorType.UnsupportedChainError`

The type of error.

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:171](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L171)

---

### message

• **message**: `string`

#### Implementation of

TypedError.message

#### Defined in

[sdk/src/types/errors.ts:173](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L173)

---

### name

• **name**: `string` = `"UnsupportedChain"`

#### Implementation of

TypedError.name

#### Defined in

[sdk/src/types/errors.ts:172](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L172)

---

### payload

• **payload**: `Object`

Additional error payload.

#### Type declaration

| Name      | Type                 |
| :-------- | :------------------- |
| `chainID` | `string` \| `number` |

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:174](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L174)
