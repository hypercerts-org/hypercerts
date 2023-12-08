[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / MintingError

# Class: MintingError

Minting transaction failed

## Hierarchy

- `Error`

  ↳ **`MintingError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](MintingError.md#constructor)

### Properties

- [payload](MintingError.md#payload)

## Constructors

### constructor

• **new MintingError**(`message`, `payload?`)

Creates a new instance of the MintingError class.

#### Parameters

| Name       | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `message`  | `string` | The error message.        |
| `payload?` | `Object` | Additional error payload. |

#### Overrides

Error.constructor

#### Defined in

[sdk/src/types/errors.ts:79](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L79)

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:72](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L72)
