[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [internal](../modules/internal.md) / EvaluatorInterface

# Interface: EvaluatorInterface

[internal](../modules/internal.md).EvaluatorInterface

## Implemented by

- [`default`](../classes/internal.default.md)

## Table of contents

### Properties

- [submitEvaluation](internal.EvaluatorInterface.md#submitevaluation)

## Properties

### submitEvaluation

• **submitEvaluation**: (`evaluation`: [`HypercertEvaluationSchema`](HypercertEvaluationSchema.md)) => `Promise`\<`CIDString`\>

#### Type declaration

▸ (`evaluation`): `Promise`\<`CIDString`\>

Submits an evaluation to the prefered storage system.

##### Parameters

| Name         | Type                                                        | Description               |
| :----------- | :---------------------------------------------------------- | :------------------------ |
| `evaluation` | [`HypercertEvaluationSchema`](HypercertEvaluationSchema.md) | The evaluation to submit. |

##### Returns

`Promise`\<`CIDString`\>

- The CID of the submitted evaluation.

#### Defined in

sdk/src/evaluations/index.ts:15
