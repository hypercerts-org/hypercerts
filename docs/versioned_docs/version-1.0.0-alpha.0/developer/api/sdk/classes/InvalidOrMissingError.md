[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / InvalidOrMissingError

# Class: InvalidOrMissingError

The provided value was undefined or empty

## Hierarchy

- `Error`

  ↳ **`InvalidOrMissingError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](InvalidOrMissingError.md#constructor)

### Properties

- [payload](InvalidOrMissingError.md#payload)

## Constructors

### constructor

• **new InvalidOrMissingError**(`message`, `payload?`)

Creates a new instance of the InvalidOrMissingError class.

#### Parameters

| Name       | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `message`  | `string` | The error message.        |
| `payload?` | `Object` | Additional error payload. |

#### Overrides

Error.constructor

#### Defined in

[sdk/src/types/errors.ts:61](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L61)

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:54](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L54)
