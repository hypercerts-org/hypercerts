[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [internal](../modules/internal.md) / default

# Class: default

[internal](../modules/internal.md).default

The EasEvaluator class provides methods for signing off-chain attestations of evaluations.
Schemas are stored on-chain in the Ethereum Attestation Service (EAS) contract.

## Table of contents

### Constructors

- [constructor](internal.default-3.md#constructor)

### Properties

- [offChain](internal.default-3.md#offchain)
- [signer](internal.default-3.md#signer)

### Methods

- [getSignature](internal.default-3.md#getsignature)
- [signOfflineEvaluation](internal.default-3.md#signofflineevaluation)

## Constructors

### constructor

• **new default**(`config`)

Creates a new EasEvaluator instance.

#### Parameters

| Name     | Type                                                                       | Description                                              |
| :------- | :------------------------------------------------------------------------- | :------------------------------------------------------- |
| `config` | `Partial`<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\> | The configuration options for the EasEvaluator instance. |

#### Defined in

[sdk/src/evaluations/eas.ts:35](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/eas.ts#L35)

## Properties

### offChain

• **offChain**: `Offchain`

The Offchain instance used for signing off-chain attestations.

#### Defined in

[sdk/src/evaluations/eas.ts:24](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/eas.ts#L24)

---

### signer

• **signer**: `Signer` & `TypedDataSigner`

The TypedDataSigner instance used for signing typed data.

#### Defined in

[sdk/src/evaluations/eas.ts:29](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/eas.ts#L29)

## Methods

### getSignature

▸ **getSignature**(`encodedData`, `recipient`, `schemaUid`): `Promise`<`SignedOffchainAttestation`\>

Gets a signature for an off-chain attestation.

#### Parameters

| Name          | Type     | Description                                       |
| :------------ | :------- | :------------------------------------------------ |
| `encodedData` | `string` | The encoded data to sign.                         |
| `recipient`   | `string` | The address of the recipient of the attestation.  |
| `schemaUid`   | `string` | The UID of the schema to use for the attestation. |

#### Returns

`Promise`<`SignedOffchainAttestation`\>

- The signature for the attestation.

#### Defined in

[sdk/src/evaluations/eas.ts:53](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/eas.ts#L53)

---

### signOfflineEvaluation

▸ **signOfflineEvaluation**(`evaluation`): `Promise`<`undefined` \| `SignedOffchainAttestation`\>

Signs an offline evaluation.

**`Throws`**

- If the evaluation data is malformed.

#### Parameters

| Name         | Type                                             | Description                  |
| :----------- | :----------------------------------------------- | :--------------------------- |
| `evaluation` | [`EvaluationData`](../modules.md#evaluationdata) | The evaluation data to sign. |

#### Returns

`Promise`<`undefined` \| `SignedOffchainAttestation`\>

- The signature for the evaluation.

#### Defined in

[sdk/src/evaluations/eas.ts:82](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/evaluations/eas.ts#L82)
