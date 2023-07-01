[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / ClientError

# Class: ClientError

An error that is caused by a problem with the client.

## Hierarchy

- `Error`

  ↳ **`ClientError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](ClientError.md#constructor)

### Properties

- [payload](ClientError.md#payload)

## Constructors

### constructor

• **new ClientError**(`message`, `payload?`)

Creates a new instance of the ClientError class.

#### Parameters

| Name       | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `message`  | `string` | The error message.        |
| `payload?` | `Object` | Additional error payload. |

#### Overrides

Error.constructor

#### Defined in

[sdk/src/types/errors.ts:25](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L25)

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:18](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L18)
