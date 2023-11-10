[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / MalformedDataError

# Class: MalformedDataError

Data doesn't conform to expectations

## Hierarchy

- `Error`

  ↳ **`MalformedDataError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](MalformedDataError.md#constructor)

### Properties

- [payload](MalformedDataError.md#payload)

## Constructors

### constructor

• **new MalformedDataError**(`message`, `payload?`): [`MalformedDataError`](MalformedDataError.md)

Creates a new instance of the MalformedDataError class.

#### Parameters

| Name       | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `message`  | `string` | The error message.        |
| `payload?` | `Object` | Additional error payload. |

#### Returns

[`MalformedDataError`](MalformedDataError.md)

#### Overrides

Error.constructor

#### Defined in

sdk/src/types/errors.ts:133

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

sdk/src/types/errors.ts:126
