---
id: "HypercertClientMethods"
title: "Interface: HypercertClientMethods"
sidebar_label: "HypercertClientMethods"
sidebar_position: 0
custom_edit_url: null
---

The methods for the Hypercert client.

## Hierarchy

- **`HypercertClientMethods`**

  ↳ [`HypercertClientInterface`](HypercertClientInterface.md)

## Properties

### batchMintClaimFractionsFromAllowlists

• **batchMintClaimFractionsFromAllowlists**: (`claimIds`: `bigint`[], `units`: `bigint`[], `proofs`: (\`0x$\{string}\` \| `Uint8Array`)[][]) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`claimIds`, `units`, `proofs`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Batch mints a claim fraction from an allowlist

##### Parameters

| Name       | Type                                   | Description                                           |
| :--------- | :------------------------------------- | :---------------------------------------------------- |
| `claimIds` | `bigint`[]                             | Array of the IDs of the claims to mint fractions for. |
| `units`    | `bigint`[]                             | Array of the number of units for each fraction.       |
| `proofs`   | (\`0x$\{string}\` \| `Uint8Array`)[][] | Array of Merkle proofs for the allowlists.            |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction receipt

A Promise that resolves to the transaction hash

**`Note`**

The length of the arrays must be equal.

**`Note`**

The order of the arrays must be equal.

#### Defined in

sdk/src/types/client.ts:237

---

### batchTransferFractions

• **batchTransferFractions**: (`fractionIds`: `bigint`[], `to`: \`0x$\{string}\`, `overrides?`: [`SupportedOverrides`](../modules.md#supportedoverrides)) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`fractionIds`, `to`, `overrides?`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Transfers multiple claim fractions to a new owner.

##### Parameters

| Name          | Type                                                     |
| :------------ | :------------------------------------------------------- |
| `fractionIds` | `bigint`[]                                               |
| `to`          | \`0x$\{string}\`                                         |
| `overrides?`  | [`SupportedOverrides`](../modules.md#supportedoverrides) |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction hash

#### Defined in

sdk/src/types/client.ts:171

---

### burnClaimFraction

• **burnClaimFraction**: (`fractionId`: `bigint`) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`fractionId`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Burns a claim fraction.

##### Parameters

| Name         | Type     | Description                           |
| :----------- | :------- | :------------------------------------ |
| `fractionId` | `bigint` | The ID of the claim fraction to burn. |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction hash

#### Defined in

sdk/src/types/client.ts:212

---

### createAllowlist

• **createAllowlist**: (`allowList`: [`AllowlistEntry`](../modules.md#allowlistentry)[], `metaData`: [`HypercertMetadata`](HypercertMetadata.md), `totalUnits`: `bigint`, `transferRestriction`: [`TransferRestrictions`](../modules.md#transferrestrictions-1)) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`allowList`, `metaData`, `totalUnits`, `transferRestriction`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Creates a new allowlist and mints a new claim with the allowlist.

##### Parameters

| Name                  | Type                                                           | Description                              |
| :-------------------- | :------------------------------------------------------------- | :--------------------------------------- |
| `allowList`           | [`AllowlistEntry`](../modules.md#allowlistentry)[]             | The allowlist for the claim.             |
| `metaData`            | [`HypercertMetadata`](HypercertMetadata.md)                    | The metadata for the claim.              |
| `totalUnits`          | `bigint`                                                       | The total number of units for the claim. |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restriction for the claim.  |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction hash

#### Defined in

sdk/src/types/client.ts:185

---

### getTransferRestrictions

• **getTransferRestrictions**: (`fractionId`: `bigint`) => `Promise`<[`TransferRestrictions`](../modules.md#transferrestrictions-1)\>

#### Type declaration

▸ (`fractionId`): `Promise`<[`TransferRestrictions`](../modules.md#transferrestrictions-1)\>

Retrieves the TransferRestrictions for a claim.

##### Parameters

| Name         | Type     | Description                      |
| :----------- | :------- | :------------------------------- |
| `fractionId` | `bigint` | The ID of the claim to retrieve. |

##### Returns

`Promise`<[`TransferRestrictions`](../modules.md#transferrestrictions-1)\>

A Promise that resolves to the applicable transfer restrictions.

#### Defined in

sdk/src/types/client.ts:149

---

### mergeFractionUnits

• **mergeFractionUnits**: (`fractionIds`: `bigint`[]) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`fractionIds`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Merges multiple claim fractions into a single claim.

##### Parameters

| Name          | Type       | Description                              |
| :------------ | :--------- | :--------------------------------------- |
| `fractionIds` | `bigint`[] | The IDs of the claim fractions to merge. |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction hash

#### Defined in

sdk/src/types/client.ts:205

---

### mintClaim

• **mintClaim**: (`metaData`: [`HypercertMetadata`](HypercertMetadata.md), `totalUnits`: `bigint`, `transferRestriction`: [`TransferRestrictions`](../modules.md#transferrestrictions-1)) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`metaData`, `totalUnits`, `transferRestriction`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Mints a new claim.

##### Parameters

| Name                  | Type                                                           | Description                              |
| :-------------------- | :------------------------------------------------------------- | :--------------------------------------- |
| `metaData`            | [`HypercertMetadata`](HypercertMetadata.md)                    | The metadata for the claim.              |
| `totalUnits`          | `bigint`                                                       | The total number of units for the claim. |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restriction for the claim.  |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction hash

#### Defined in

sdk/src/types/client.ts:138

---

### mintClaimFractionFromAllowlist

• **mintClaimFractionFromAllowlist**: (`claimId`: `bigint`, `units`: `bigint`, `proof`: (\`0x$\{string}\` \| `Uint8Array`)[]) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`claimId`, `units`, `proof`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Mints a claim fraction from an allowlist.

##### Parameters

| Name      | Type                                 | Description                                 |
| :-------- | :----------------------------------- | :------------------------------------------ |
| `claimId` | `bigint`                             | The ID of the claim to mint a fraction for. |
| `units`   | `bigint`                             | The number of units for the fraction.       |
| `proof`   | (\`0x$\{string}\` \| `Uint8Array`)[] | The Merkle proof for the allowlist.         |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction hash

#### Defined in

sdk/src/types/client.ts:221

---

### splitFractionUnits

• **splitFractionUnits**: (`fractionId`: `bigint`, `fractions`: `bigint`[]) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`fractionId`, `fractions`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Splits a claim into multiple fractions.

##### Parameters

| Name         | Type       | Description                   |
| :----------- | :--------- | :---------------------------- |
| `fractionId` | `bigint`   | The ID of the claim to split. |
| `fractions`  | `bigint`[] | -                             |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction hash

#### Defined in

sdk/src/types/client.ts:198

---

### transferFraction

• **transferFraction**: (`fractionId`: `bigint`, `to`: \`0x$\{string}\`, `overrides?`: [`SupportedOverrides`](../modules.md#supportedoverrides)) => `Promise`<`undefined` \| \`0x$\{string}\`\>

#### Type declaration

▸ (`fractionId`, `to`, `overrides?`): `Promise`<`undefined` \| \`0x$\{string}\`\>

Transfers a claim fraction to a new owner.

##### Parameters

| Name         | Type                                                     |
| :----------- | :------------------------------------------------------- |
| `fractionId` | `bigint`                                                 |
| `to`         | \`0x$\{string}\`                                         |
| `overrides?` | [`SupportedOverrides`](../modules.md#supportedoverrides) |

##### Returns

`Promise`<`undefined` \| \`0x$\{string}\`\>

A Promise that resolves to the transaction hash

#### Defined in

sdk/src/types/client.ts:158
