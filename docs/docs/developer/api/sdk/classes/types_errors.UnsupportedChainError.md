[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) / UnsupportedChainError

# Class: UnsupportedChainError

[types/errors](../modules/types_errors.md).UnsupportedChainError

This blockchain is not yet supported
Please file an issue

## Implements

- [`TypedError`](../interfaces/types_errors.TypedError.md)

## Table of contents

### Constructors

- [constructor](types_errors.UnsupportedChainError.md#constructor)

### Properties

- [\_\_type](types_errors.UnsupportedChainError.md#__type)
- [message](types_errors.UnsupportedChainError.md#message)
- [name](types_errors.UnsupportedChainError.md#name)
- [payload](types_errors.UnsupportedChainError.md#payload)

## Constructors

### constructor

• **new UnsupportedChainError**(`message`, `chainID`)

#### Parameters

| Name      | Type                 |
| :-------- | :------------------- |
| `message` | `string`             |
| `chainID` | `string` \| `number` |

#### Defined in

[sdk/src/types/errors.ts:144](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L144)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.UnsupportedChainError`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[\_\_type](../interfaces/types_errors.TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:140](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L140)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[message](../interfaces/types_errors.TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:142](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L142)

---

### name

• **name**: `string` = `"UnsupportedChain"`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[name](../interfaces/types_errors.TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:141](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L141)

---

### payload

• **payload**: `Object`

#### Type declaration

| Name      | Type                 |
| :-------- | :------------------- |
| `chainID` | `string` \| `number` |

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[payload](../interfaces/types_errors.TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:143](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/errors.ts#L143)
