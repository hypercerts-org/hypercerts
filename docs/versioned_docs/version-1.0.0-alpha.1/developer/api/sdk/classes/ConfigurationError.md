[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / ConfigurationError

# Class: ConfigurationError

The configuration was invalid

## Hierarchy

- `Error`

  ↳ **`ConfigurationError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Table of contents

### Constructors

- [constructor](ConfigurationError.md#constructor)

### Properties

- [payload](ConfigurationError.md#payload)

## Constructors

### constructor

• **new ConfigurationError**(`message`, `payload?`)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `message`  | `string` |
| `payload?` | `Object` |

#### Overrides

Error.constructor

#### Defined in

[sdk/src/types/errors.ts:166](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L166)

## Properties

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:165](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/errors.ts#L165)
