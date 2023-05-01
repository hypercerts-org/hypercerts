[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) /
UnknownSchemaError

# Class: UnknownSchemaError

[types/errors](../modules/types_errors.md).UnknownSchemaError

Schema could not be loaded

## Implements

- [`TypedError`](../interfaces/types_errors.TypedError.md)

## Table of contents

### Constructors

- [constructor](types_errors.UnknownSchemaError.md#constructor)

### Properties

- [\_\_type](types_errors.UnknownSchemaError.md#__type)
- [message](types_errors.UnknownSchemaError.md#message)
- [name](types_errors.UnknownSchemaError.md#name)
- [payload](types_errors.UnknownSchemaError.md#payload)

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

[sdk/src/types/errors.ts:109](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L109)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.UnknownSchemaError`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[\_\_type](../interfaces/types_errors.TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:105](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L105)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[message](../interfaces/types_errors.TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:107](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L107)

---

### name

• **name**: `string` = `"UnknownSchemaError"`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[name](../interfaces/types_errors.TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:106](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L106)

---

### payload

• `Optional` **payload**: `Object`

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `schemaName` | `string` |

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[payload](../interfaces/types_errors.TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:108](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L108)
