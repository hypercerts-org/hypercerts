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

[sdk/src/types/errors.ts:59](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L59)

## Properties

### \_\_type

• **\_\_type**: `ErrorType` = `ErrorType.InvalidOrMissingError`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[\_\_type](../interfaces/TypedError.md#__type)

#### Defined in

[sdk/src/types/errors.ts:55](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L55)

---

### message

• **message**: `string`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[message](../interfaces/TypedError.md#message)

#### Defined in

[sdk/src/types/errors.ts:57](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L57)

---

### name

• **name**: `string` = `"InvalidOrMissingError"`

#### Implementation of

[TypedError](../interfaces/TypedError.md).[name](../interfaces/TypedError.md#name)

#### Defined in

[sdk/src/types/errors.ts:56](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L56)

---

### payload

• **payload**: `Object`

#### Type declaration

| Name      | Type     |
| :-------- | :------- |
| `keyName` | `string` |

#### Implementation of

[TypedError](../interfaces/TypedError.md).[payload](../interfaces/TypedError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:58](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/errors.ts#L58)
