[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertClientInterface

# Interface: HypercertClientInterface

The interface for the Hypercert client.

## Hierarchy

- [`HypercertClientMethods`](HypercertClientMethods.md)

- [`HypercertClientState`](HypercertClientState.md)

  ↳ **`HypercertClientInterface`**

## Implemented by

- [`HypercertClient`](../classes/HypercertClient.md)

## Table of contents

### Properties

- [burnClaimFraction](HypercertClientInterface.md#burnclaimfraction)
- [contract](HypercertClientInterface.md#contract)
- [createAllowlist](HypercertClientInterface.md#createallowlist)
- [indexer](HypercertClientInterface.md#indexer)
- [mergeClaimUnits](HypercertClientInterface.md#mergeclaimunits)
- [mintClaim](HypercertClientInterface.md#mintclaim)
- [mintClaimFractionFromAllowlist](HypercertClientInterface.md#mintclaimfractionfromallowlist)
- [readonly](HypercertClientInterface.md#readonly)
- [splitClaimUnits](HypercertClientInterface.md#splitclaimunits)
- [storage](HypercertClientInterface.md#storage)

## Properties

### burnClaimFraction

• **burnClaimFraction**: (`claimId`: `BigNumberish`) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimId`): `Promise`<`ContractTransaction`\>

Burns a claim fraction.

##### Parameters

| Name      | Type           | Description                           |
| :-------- | :------------- | :------------------------------------ |
| `claimId` | `BigNumberish` | The ID of the claim fraction to burn. |

##### Returns

`Promise`<`ContractTransaction`\>

A Promise that resolves to the transaction receipt

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[burnClaimFraction](HypercertClientMethods.md#burnclaimfraction)

#### Defined in

[sdk/src/types/client.ts:172](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L172)

---

### contract

• **contract**: [`HypercertMinter`](HypercertMinter.md)

The contract used by the client.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[contract](HypercertClientState.md#contract)

#### Defined in

[sdk/src/types/client.ts:117](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L117)

---

### createAllowlist

• **createAllowlist**: (`allowList`: [`Allowlist`](../modules.md#allowlist), `metaData`: [`HypercertMetadata`](HypercertMetadata.md), `totalUnits`: `BigNumberish`, `transferRestriction`: [`TransferRestrictions`](../modules.md#transferrestrictions-1)) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`allowList`, `metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

Creates a new allowlist and mints a new claim with the allowlist.

##### Parameters

| Name                  | Type                                                           | Description                              |
| :-------------------- | :------------------------------------------------------------- | :--------------------------------------- |
| `allowList`           | [`Allowlist`](../modules.md#allowlist)                         | The allowlist for the claim.             |
| `metaData`            | [`HypercertMetadata`](HypercertMetadata.md)                    | The metadata for the claim.              |
| `totalUnits`          | `BigNumberish`                                                 | The total number of units for the claim. |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restriction for the claim.  |

##### Returns

`Promise`<`ContractTransaction`\>

A Promise that resolves to the transaction receipt

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[createAllowlist](HypercertClientMethods.md#createallowlist)

#### Defined in

[sdk/src/types/client.ts:145](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L145)

---

### indexer

• **indexer**: `default`

The indexer used by the client.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[indexer](HypercertClientState.md#indexer)

#### Defined in

[sdk/src/types/client.ts:115](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L115)

---

### mergeClaimUnits

• **mergeClaimUnits**: (`claimIds`: `BigNumberish`[]) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimIds`): `Promise`<`ContractTransaction`\>

Merges multiple claim fractions into a single claim.

##### Parameters

| Name       | Type             | Description                              |
| :--------- | :--------------- | :--------------------------------------- |
| `claimIds` | `BigNumberish`[] | The IDs of the claim fractions to merge. |

##### Returns

`Promise`<`ContractTransaction`\>

A Promise that resolves to the transaction receipt

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mergeClaimUnits](HypercertClientMethods.md#mergeclaimunits)

#### Defined in

[sdk/src/types/client.ts:165](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L165)

---

### mintClaim

• **mintClaim**: (`metaData`: [`HypercertMetadata`](HypercertMetadata.md), `totalUnits`: `BigNumberish`, `transferRestriction`: [`TransferRestrictions`](../modules.md#transferrestrictions-1)) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

Mints a new claim.

##### Parameters

| Name                  | Type                                                           | Description                              |
| :-------------------- | :------------------------------------------------------------- | :--------------------------------------- |
| `metaData`            | [`HypercertMetadata`](HypercertMetadata.md)                    | The metadata for the claim.              |
| `totalUnits`          | `BigNumberish`                                                 | The total number of units for the claim. |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restriction for the claim.  |

##### Returns

`Promise`<`ContractTransaction`\>

A Promise that resolves to the transaction receipt

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mintClaim](HypercertClientMethods.md#mintclaim)

#### Defined in

[sdk/src/types/client.ts:131](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L131)

---

### mintClaimFractionFromAllowlist

• **mintClaimFractionFromAllowlist**: (`claimId`: `BigNumberish`, `units`: `BigNumberish`, `proof`: `BytesLike`[]) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimId`, `units`, `proof`): `Promise`<`ContractTransaction`\>

Mints a claim fraction from an allowlist.

##### Parameters

| Name      | Type           | Description                                 |
| :-------- | :------------- | :------------------------------------------ |
| `claimId` | `BigNumberish` | The ID of the claim to mint a fraction for. |
| `units`   | `BigNumberish` | The number of units for the fraction.       |
| `proof`   | `BytesLike`[]  | The Merkle proof for the allowlist.         |

##### Returns

`Promise`<`ContractTransaction`\>

A Promise that resolves to the transaction receipt

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mintClaimFractionFromAllowlist](HypercertClientMethods.md#mintclaimfractionfromallowlist)

#### Defined in

[sdk/src/types/client.ts:181](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L181)

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[readonly](HypercertClientState.md#readonly)

#### Defined in

[sdk/src/types/client.ts:111](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L111)

---

### splitClaimUnits

• **splitClaimUnits**: (`claimId`: `BigNumberish`, `fractions`: `BigNumberish`[]) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimId`, `fractions`): `Promise`<`ContractTransaction`\>

Splits a claim into multiple fractions.

##### Parameters

| Name        | Type             | Description                            |
| :---------- | :--------------- | :------------------------------------- |
| `claimId`   | `BigNumberish`   | The ID of the claim to split.          |
| `fractions` | `BigNumberish`[] | The number of units for each fraction. |

##### Returns

`Promise`<`ContractTransaction`\>

A Promise that resolves to the transaction receipt

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[splitClaimUnits](HypercertClientMethods.md#splitclaimunits)

#### Defined in

[sdk/src/types/client.ts:158](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L158)

---

### storage

• **storage**: [`HypercertStorageInterface`](HypercertStorageInterface.md)

The storage layer used by the client.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[storage](HypercertClientState.md#storage)

#### Defined in

[sdk/src/types/client.ts:113](https://github.com/Network-Goods/hypercerts/blob/e1b6279/sdk/src/types/client.ts#L113)
