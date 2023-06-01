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

[sdk/src/types/errors.ts:109](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L109)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.UnknownSchemaError`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:105](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L105)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[message](../interfaces/TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:107](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L107)

---

### name

• **name**: `string` = `"UnknownSchemaError"`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[name](../interfaces/TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:106](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L106)

---

### payload

• `Optional` **payload**: `Object`

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `schemaName` | `string` |

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:108](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L108)
