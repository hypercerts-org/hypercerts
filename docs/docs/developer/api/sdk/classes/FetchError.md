[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / FetchError

# Class: FetchError

Fails fetching a remote resource

## Hierarchy

- `Error`

  ↳ **`FetchError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](FetchError.md#constructor)

### Properties

- [payload](FetchError.md#payload)

## Constructors

### constructor

• **new FetchError**(`message`, `payload?`): [`FetchError`](FetchError.md)

Creates a new instance of the FetchError class.

#### Parameters

| Name       | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `message`  | `string` | The error message.        |
| `payload?` | `Object` | Additional error payload. |

#### Returns

[`FetchError`](FetchError.md)

#### Overrides

Error.constructor

#### Defined in

sdk/src/types/errors.ts:43

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

sdk/src/types/errors.ts:36
