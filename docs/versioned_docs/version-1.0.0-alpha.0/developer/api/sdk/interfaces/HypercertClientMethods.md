[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertClientMethods

# Interface: HypercertClientMethods

The methods for the Hypercert client.

## Hierarchy

- **`HypercertClientMethods`**

  ↳ [`HypercertClientInterface`](HypercertClientInterface.md)

## Table of contents

### Properties

- [batchMintClaimFractionsFromAllowlists](HypercertClientMethods.md#batchmintclaimfractionsfromallowlists)
- [burnClaimFraction](HypercertClientMethods.md#burnclaimfraction)
- [createAllowlist](HypercertClientMethods.md#createallowlist)
- [mergeClaimUnits](HypercertClientMethods.md#mergeclaimunits)
- [mintClaim](HypercertClientMethods.md#mintclaim)
- [mintClaimFractionFromAllowlist](HypercertClientMethods.md#mintclaimfractionfromallowlist)
- [splitClaimUnits](HypercertClientMethods.md#splitclaimunits)

## Properties

### batchMintClaimFractionsFromAllowlists

• **batchMintClaimFractionsFromAllowlists**: (`claimIds`: `BigNumberish`[], `units`: `BigNumberish`[], `proofs`: `BytesLike`[][]) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimIds`, `units`, `proofs`): `Promise`<`ContractTransaction`\>

Batch mints a claim fraction from an allowlist

**`Note`**

The length of the arrays must be equal.

**`Note`**

The order of the arrays must be equal.

##### Parameters

| Name       | Type             | Description                                           |
| :--------- | :--------------- | :---------------------------------------------------- |
| `claimIds` | `BigNumberish`[] | Array of the IDs of the claims to mint fractions for. |
| `units`    | `BigNumberish`[] | Array of the number of units for each fraction.       |
| `proofs`   | `BytesLike`[][]  | Array of Merkle proofs for the allowlists.            |

##### Returns

`Promise`<`ContractTransaction`\>

A Promise that resolves to the transaction receipt

A Promise that resolves to the transaction receipt

#### Defined in

[sdk/src/types/client.ts:200](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L200)

---

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

#### Defined in

[sdk/src/types/client.ts:175](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L175)

---

### createAllowlist

• **createAllowlist**: (`allowList`: [`AllowlistEntry`](../modules.md#allowlistentry)[], `metaData`: [`HypercertMetadata`](HypercertMetadata.md), `totalUnits`: `BigNumberish`, `transferRestriction`: [`TransferRestrictions`](../modules.md#transferrestrictions-1)) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`allowList`, `metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

Creates a new allowlist and mints a new claim with the allowlist.

##### Parameters

| Name                  | Type                                                           | Description                              |
| :-------------------- | :------------------------------------------------------------- | :--------------------------------------- |
| `allowList`           | [`AllowlistEntry`](../modules.md#allowlistentry)[]             | The allowlist for the claim.             |
| `metaData`            | [`HypercertMetadata`](HypercertMetadata.md)                    | The metadata for the claim.              |
| `totalUnits`          | `BigNumberish`                                                 | The total number of units for the claim. |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restriction for the claim.  |

##### Returns

`Promise`<`ContractTransaction`\>

A Promise that resolves to the transaction receipt

#### Defined in

[sdk/src/types/client.ts:148](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L148)

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

#### Defined in

[sdk/src/types/client.ts:168](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L168)

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

#### Defined in

[sdk/src/types/client.ts:134](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L134)

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

#### Defined in

[sdk/src/types/client.ts:184](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L184)

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

#### Defined in

[sdk/src/types/client.ts:161](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L161)
