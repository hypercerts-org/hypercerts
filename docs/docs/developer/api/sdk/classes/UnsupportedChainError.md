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

[sdk/src/types/errors.ts:144](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L144)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.UnsupportedChainError`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:140](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L140)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[message](../interfaces/TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:142](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L142)

---

### name

• **name**: `string` = `"UnsupportedChain"`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[name](../interfaces/TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:141](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L141)

---

### payload

• **payload**: `Object`

#### Type declaration

| Name      | Type                 |
| :-------- | :------------------- |
| `chainID` | `string` \| `number` |

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:143](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L143)
