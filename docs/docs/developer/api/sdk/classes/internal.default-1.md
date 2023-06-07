[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [internal](../modules/internal.md) / default

# Class: default

[internal](../modules/internal.md).default

## Implements

- [`EvaluatorInterface`](../interfaces/internal.EvaluatorInterface.md)

## Table of contents

### Constructors

- [constructor](internal.default-1.md#constructor)

### Properties

- [eas](internal.default-1.md#eas)
- [signer](internal.default-1.md#signer)
- [storage](internal.default-1.md#storage)

### Methods

- [submitEvaluation](internal.default-1.md#submitevaluation)

## Constructors

### constructor

• **new default**(`config?`)

#### Parameters

| Name     | Type                                                                       |
| :------- | :------------------------------------------------------------------------- |
| `config` | `Partial`<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\> |

#### Defined in

[sdk/src/evaluations/index.ts:35](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/index.ts#L35)

## Properties

### eas

• **eas**: [`default`](internal.default-3.md)

#### Defined in

[sdk/src/evaluations/index.ts:33](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/index.ts#L33)

---

### signer

• **signer**: `Signer` & `TypedDataSigner`

#### Defined in

[sdk/src/evaluations/index.ts:29](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/index.ts#L29)

---

### storage

• **storage**: [`default`](internal.default.md)

#### Defined in

[sdk/src/evaluations/index.ts:31](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/index.ts#L31)

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

[sdk/src/evaluations/index.ts:47](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/index.ts#L47)
