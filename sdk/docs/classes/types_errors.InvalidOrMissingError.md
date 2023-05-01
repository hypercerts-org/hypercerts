[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/errors](../modules/types_errors.md) /
InvalidOrMissingError

# Class: InvalidOrMissingError

[types/errors](../modules/types_errors.md).InvalidOrMissingError

The provided value was undefined or empty

## Implements

- [`TypedError`](../interfaces/types_errors.TypedError.md)

## Table of contents

### Constructors

- [constructor](types_errors.InvalidOrMissingError.md#constructor)

### Properties

- [\_\_type](types_errors.InvalidOrMissingError.md#__type)
- [message](types_errors.InvalidOrMissingError.md#message)
- [name](types_errors.InvalidOrMissingError.md#name)
- [payload](types_errors.InvalidOrMissingError.md#payload)

## Constructors

### constructor

• **new InvalidOrMissingError**(`message`, `keyName`)

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `message` | `string` |
| `keyName` | `string` |

#### Defined in

[sdk/src/types/errors.ts:59](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L59)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.InvalidOrMissingError`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[\_\_type](../interfaces/types_errors.TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:55](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L55)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[message](../interfaces/types_errors.TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:57](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L57)

---

### name

• **name**: `string` = `"InvalidOrMissingError"`

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[name](../interfaces/types_errors.TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:56](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L56)

---

### payload

• **payload**: `Object`

#### Type declaration

| Name      | Type     |
| :-------- | :------- |
| `keyName` | `string` |

#### Implementation of

[TypedError](../interfaces/types_errors.TypedError.md).[payload](../interfaces/types_errors.TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:58](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/errors.ts#L58)
