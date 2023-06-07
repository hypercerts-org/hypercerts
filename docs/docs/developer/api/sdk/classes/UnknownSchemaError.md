[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / UnknownSchemaError

# Class: UnknownSchemaError

Schema could not be loaded

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](UnknownSchemaError.md#constructor)

### Properties

- [\_\_type](UnknownSchemaError.md#__type)
- [message](UnknownSchemaError.md#message)
- [name](UnknownSchemaError.md#name)
- [payload](UnknownSchemaError.md#payload)

## Constructors

### constructor

• **new UnknownSchemaError**(`message`, `payload?`)

#### Parameters

| Name                 | Type     |
| :------------------- | :------- |
| `message`            | `string` |
| `payload?`           | `Object` |
| `payload.schemaName` | `string` |

#### Defined in

[sdk/src/types/errors.ts:140](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L140)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md) = `ErrorType.UnknownSchemaError`

The type of error.

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:136](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L136)

---

### message

• **message**: `string`

#### Implementation of

TypedError.message

#### Defined in

[sdk/src/types/errors.ts:138](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L138)

---

### name

• **name**: `string` = `"UnknownSchemaError"`

#### Implementation of

TypedError.name

#### Defined in

[sdk/src/types/errors.ts:137](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L137)

---

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `schemaName` | `string` |

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:139](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/errors.ts#L139)
