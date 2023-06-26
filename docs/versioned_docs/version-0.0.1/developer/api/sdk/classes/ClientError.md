[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / ClientError

# Class: ClientError

An error that is caused by a problem with the client.

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](ClientError.md#constructor)

### Properties

- [\_\_type](ClientError.md#__type)
- [message](ClientError.md#message)
- [name](ClientError.md#name)
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

#### Defined in

[sdk/src/types/errors.ts:59](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L59)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md) = `ErrorType.ClientError`

The type of error.

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:37](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L37)

---

### message

• **message**: `string`

The error message.

#### Implementation of

TypedError.message

#### Defined in

[sdk/src/types/errors.ts:47](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L47)

---

### name

• **name**: `string` = `"ClientError"`

The name of the error.

#### Implementation of

TypedError.name

#### Defined in

[sdk/src/types/errors.ts:42](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L42)

---

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:52](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L52)
