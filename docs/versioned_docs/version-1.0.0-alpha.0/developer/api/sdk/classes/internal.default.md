[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [internal](../modules/internal.md) / default

# Class: default

[internal](../modules/internal.md).default

## Implements

- [`EvaluatorInterface`](../interfaces/internal.EvaluatorInterface.md)

## Table of contents

### Constructors

- [constructor](internal.default.md#constructor)

### Properties

- [eas](internal.default.md#eas)
- [readonly](internal.default.md#readonly)
- [signer](internal.default.md#signer)
- [storage](internal.default.md#storage)

### Methods

- [submitEvaluation](internal.default.md#submitevaluation)

## Constructors

### constructor

• **new default**(`config?`)

#### Parameters

| Name     | Type                                                                       |
| :------- | :------------------------------------------------------------------------- |
| `config` | `Partial`<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\> |

#### Defined in

[sdk/src/evaluations/index.ts:37](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/evaluations/index.ts#L37)

## Properties

### eas

• **eas**: [`default`](internal.default-2.md)

#### Defined in

[sdk/src/evaluations/index.ts:33](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/evaluations/index.ts#L33)

---

### readonly

• **readonly**: `boolean` = `true`

#### Defined in

[sdk/src/evaluations/index.ts:35](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/evaluations/index.ts#L35)

---

### signer

• `Optional` **signer**: `Signer` & `TypedDataSigner`

#### Defined in

[sdk/src/evaluations/index.ts:29](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/evaluations/index.ts#L29)

---

### storage

• **storage**: [`HypercertsStorage`](HypercertsStorage.md)

#### Defined in

[sdk/src/evaluations/index.ts:31](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/evaluations/index.ts#L31)

## Methods

### submitEvaluation

▸ **submitEvaluation**(`evaluation`): `Promise`<`CIDString`\>

Submits an evaluation to the prefered storage system.

#### Parameters

| Name         | Type                                                                      | Description               |
| :----------- | :------------------------------------------------------------------------ | :------------------------ |
| `evaluation` | [`HypercertEvaluationSchema`](../interfaces/HypercertEvaluationSchema.md) | The evaluation to submit. |

#### Returns

`Promise`<`CIDString`\>

- The CID of the submitted evaluation.

#### Implementation of

EvaluatorInterface.submitEvaluation

#### Defined in

[sdk/src/evaluations/index.ts:53](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/evaluations/index.ts#L53)
