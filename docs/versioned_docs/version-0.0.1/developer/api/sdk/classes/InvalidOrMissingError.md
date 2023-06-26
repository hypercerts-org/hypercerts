[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / InvalidOrMissingError

# Class: InvalidOrMissingError

The provided value was undefined or empty

## Implements

- [`TypedError`](../interfaces/TypedError.md)

## Table of contents

### Constructors

- [constructor](InvalidOrMissingError.md#constructor)

### Properties

- [\_\_type](InvalidOrMissingError.md#__type)
- [message](InvalidOrMissingError.md#message)
- [name](InvalidOrMissingError.md#name)
- [payload](InvalidOrMissingError.md#payload)

## Constructors

### constructor

• **new InvalidOrMissingError**(`message`, `keyName`)

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `message` | `string` |
| `keyName` | `string` |

#### Defined in

[sdk/src/types/errors.ts:90](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L90)

## Properties

### \_\_type

• **\_\_type**: [`ErrorType`](../enums/internal.ErrorType.md) = `ErrorType.InvalidOrMissingError`

The type of error.

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:86](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L86)

---

### message

• **message**: `string`

#### Implementation of

TypedError.message

#### Defined in

[sdk/src/types/errors.ts:88](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L88)

---

### name

• **name**: `string` = `"InvalidOrMissingError"`

#### Implementation of

TypedError.name

#### Defined in

[sdk/src/types/errors.ts:87](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L87)

---

### payload

• **payload**: `Object`

Additional error payload.

#### Type declaration

| Name      | Type     |
| :-------- | :------- |
| `keyName` | `string` |

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:89](https://github.com/Network-Goods/hypercerts/blob/721e383/sdk/src/types/errors.ts#L89)
