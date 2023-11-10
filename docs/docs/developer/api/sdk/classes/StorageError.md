[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / StorageError

# Class: StorageError

Fails storing to a remote resource

## Hierarchy

- `Error`

  ↳ **`StorageError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](StorageError.md#constructor)

### Properties

- [payload](StorageError.md#payload)

## Constructors

### constructor

• **new StorageError**(`message`, `payload?`): [`StorageError`](StorageError.md)

Creates a new instance of the StorageError class.

#### Parameters

| Name       | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `message`  | `string` | The error message.        |
| `payload?` | `Object` | Additional error payload. |

#### Returns

[`StorageError`](StorageError.md)

#### Overrides

Error.constructor

#### Defined in

sdk/src/types/errors.ts:97

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

sdk/src/types/errors.ts:90
