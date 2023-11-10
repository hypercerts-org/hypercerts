[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [internal](../modules/internal.md) / default

# Class: default

[internal](../modules/internal.md).default

## Implements

- [`EvaluatorInterface`](../interfaces/internal.EvaluatorInterface.md)

## Table of contents

### Constructors

- [constructor](internal.default.md#constructor)

### Properties

- [readonly](internal.default.md#readonly)
- [storage](internal.default.md#storage)

### Methods

- [submitEvaluation](internal.default.md#submitevaluation)

## Constructors

### constructor

• **new default**(`config`): [`default`](internal.default.md)

#### Parameters

| Name     | Type                                                                        |
| :------- | :-------------------------------------------------------------------------- |
| `config` | `Partial`\<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\> |

#### Returns

[`default`](internal.default.md)

#### Defined in

sdk/src/evaluations/index.ts:23

## Properties

### readonly

• **readonly**: `boolean` = `true`

#### Defined in

sdk/src/evaluations/index.ts:21

---

### storage

• **storage**: [`HypercertsStorage`](HypercertsStorage.md)

#### Defined in

sdk/src/evaluations/index.ts:19

## Methods

### submitEvaluation

▸ **submitEvaluation**(`evaluation`): `Promise`\<`CIDString`\>

Submits an evaluation to the prefered storage system.

#### Parameters

| Name         | Type                                                                      | Description               |
| :----------- | :------------------------------------------------------------------------ | :------------------------ |
| `evaluation` | [`HypercertEvaluationSchema`](../interfaces/HypercertEvaluationSchema.md) | The evaluation to submit. |

#### Returns

`Promise`\<`CIDString`\>

- The CID of the submitted evaluation.

#### Implementation of

[EvaluatorInterface](../interfaces/internal.EvaluatorInterface.md).[submitEvaluation](../interfaces/internal.EvaluatorInterface.md#submitevaluation)

#### Defined in

sdk/src/evaluations/index.ts:32
