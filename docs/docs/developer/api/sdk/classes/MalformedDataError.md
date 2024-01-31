---
id: "MalformedDataError"
title: "Class: MalformedDataError"
sidebar_label: "MalformedDataError"
sidebar_position: 0
custom_edit_url: null
---

Data doesn't conform to expectations

## Hierarchy

- `Error`

  ↳ **`MalformedDataError`**

## Implements

- [`CustomError`](../interfaces/CustomError.md)

## Constructors

### constructor

• **new MalformedDataError**(`message`, `payload?`): [`MalformedDataError`](MalformedDataError.md)

Creates a new instance of the MalformedDataError class.

#### Parameters

| Name       | Type     | Description               |
| :--------- | :------- | :------------------------ |
| `message`  | `string` | The error message.        |
| `payload?` | `Object` | Additional error payload. |

#### Returns

[`MalformedDataError`](MalformedDataError.md)

#### Overrides

Error.constructor

#### Defined in

[sdk/src/types/errors.ts:155](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/errors.ts#L155)

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

#### Index signature

▪ [key: `string`]: `unknown`

#### Implementation of

[CustomError](../interfaces/CustomError.md).[payload](../interfaces/CustomError.md#payload)

#### Defined in

[sdk/src/types/errors.ts:148](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/errors.ts#L148)

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
