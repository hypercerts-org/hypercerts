[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / UnknownSchemaError

# Class: UnknownSchemaError

Schema could not be loaded

## Hierarchy

- `Error`

  ↳ **`UnknownSchemaError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](UnknownSchemaError.md#constructor)

### Properties

- [payload](UnknownSchemaError.md#payload)

## Constructors

### constructor

• **new UnknownSchemaError**(`message`, `payload?`)

Creates a new instance of the UnknownSchemaError class.

#### Parameters

| Name                 | Type     | Description               |
| :------------------- | :------- | :------------------------ |
| `message`            | `string` | The error message.        |
| `payload?`           | `Object` | Additional error payload. |
| `payload.schemaName` | `string` | -                         |

#### Overrides

Error.constructor

#### Defined in

[sdk/src/types/errors.ts:115](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L115)

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `schemaName` | `string` |

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:108](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L108)
