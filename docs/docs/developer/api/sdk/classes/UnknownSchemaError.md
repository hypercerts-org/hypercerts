---
id: "UnknownSchemaError"
title: "Class: UnknownSchemaError"
sidebar_label: "UnknownSchemaError"
sidebar_position: 0
custom_edit_url: null
---

Schema could not be loaded

## Hierarchy

- `Error`

  ↳ **`UnknownSchemaError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Constructors

### constructor

• **new UnknownSchemaError**(`message`, `payload?`): [`UnknownSchemaError`](UnknownSchemaError.md)

Creates a new instance of the UnknownSchemaError class.

#### Parameters

| Name                 | Type     | Description               |
| :------------------- | :------- | :------------------------ |
| `message`            | `string` | The error message.        |
| `payload?`           | `Object` | Additional error payload. |
| `payload.schemaName` | `string` | -                         |

#### Returns

[`UnknownSchemaError`](UnknownSchemaError.md)

#### Overrides

Error.constructor

#### Defined in

[sdk/src/types/errors.ts:137](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/errors.ts#L137)

## Properties

### cause

• `Optional` **cause**: `unknown`

#### Inherited from

Error.cause

#### Defined in

node_modules/.pnpm/typescript@5.3.2/node_modules/typescript/lib/lib.es2022.error.d.ts:24

---

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/.pnpm/typescript@5.3.2/node_modules/typescript/lib/lib.es5.d.ts:1076

---

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/.pnpm/typescript@5.3.2/node_modules/typescript/lib/lib.es5.d.ts:1075

---

### payload

• `Optional` **payload**: `Object`

Additional error payload.

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `schemaName` | `string` |

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:130](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/errors.ts#L130)

---

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/.pnpm/typescript@5.3.2/node_modules/typescript/lib/lib.es5.d.ts:1077

---

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name          | Type         |
| :------------ | :----------- |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/.pnpm/@types+node@18.18.7/node_modules/@types/node/globals.d.ts:11

---

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/.pnpm/@types+node@18.18.7/node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name              | Type       |
| :---------------- | :--------- |
| `targetObject`    | `object`   |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/.pnpm/@types+node@18.18.7/node_modules/@types/node/globals.d.ts:4
