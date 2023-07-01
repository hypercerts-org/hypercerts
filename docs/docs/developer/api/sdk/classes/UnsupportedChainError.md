[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / UnsupportedChainError

# Class: UnsupportedChainError

This blockchain is not yet supported
Please file an issue

## Hierarchy

- `Error`

  ↳ **`UnsupportedChainError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](UnsupportedChainError.md#constructor)

### Properties

- [payload](UnsupportedChainError.md#payload)

## Constructors

### constructor

• **new UnsupportedChainError**(`message`, `payload?`)

Creates a new instance of the UnsupportedChainError class.

#### Parameters

| Name              | Type                                | Description               |
| :---------------- | :---------------------------------- | :------------------------ |
| `message`         | `string`                            | The error message.        |
| `payload?`        | `Object`                            | Additional error payload. |
| `payload.chainID` | `undefined` \| `string` \| `number` | -                         |

#### Overrides

Error.constructor

#### Defined in

[sdk/src/types/errors.ts:152](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L152)

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Type declaration

| Name      | Type                                |
| :-------- | :---------------------------------- |
| `chainID` | `undefined` \| `string` \| `number` |

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:145](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L145)
