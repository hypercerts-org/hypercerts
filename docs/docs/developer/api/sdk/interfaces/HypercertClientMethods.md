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
- [mergeFractionUnits](HypercertClientMethods.md#mergefractionunits)
- [mintClaim](HypercertClientMethods.md#mintclaim)
- [mintClaimFractionFromAllowlist](HypercertClientMethods.md#mintclaimfractionfromallowlist)
- [splitFractionUnits](HypercertClientMethods.md#splitfractionunits)

## Properties

### batchMintClaimFractionsFromAllowlists

• **batchMintClaimFractionsFromAllowlists**: (`claimIds`: `bigint`[], `units`: `bigint`[], `proofs`: (\`0x$\{string}\` \| `Uint8Array`)[][]) => `Promise`\<\`0x$\{string}\`\>

#### Type declaration

▸ (`claimIds`, `units`, `proofs`): `Promise`\<\`0x$\{string}\`\>

Batch mints a claim fraction from an allowlist

##### Parameters

| Name       | Type                                   | Description                                           |
| :--------- | :------------------------------------- | :---------------------------------------------------- |
| `claimIds` | `bigint`[]                             | Array of the IDs of the claims to mint fractions for. |
| `units`    | `bigint`[]                             | Array of the number of units for each fraction.       |
| `proofs`   | (\`0x$\{string}\` \| `Uint8Array`)[][] | Array of Merkle proofs for the allowlists.            |

##### Returns

`Promise`\<\`0x$\{string}\`\>

A Promise that resolves to the transaction receipt

A Promise that resolves to the transaction receipt

**`Note`**

The length of the arrays must be equal.

**`Note`**

The order of the arrays must be equal.

#### Defined in

sdk/src/types/client.ts:212

---

### burnClaimFraction

• **burnClaimFraction**: (`fractionId`: `bigint`) => `Promise`\<\`0x$\{string}\`\>

#### Type declaration

▸ (`fractionId`): `Promise`\<\`0x$\{string}\`\>

Burns a claim fraction.

##### Parameters

| Name         | Type     | Description                           |
| :----------- | :------- | :------------------------------------ |
| `fractionId` | `bigint` | The ID of the claim fraction to burn. |

##### Returns

`Promise`\<\`0x$\{string}\`\>

A Promise that resolves to the transaction receipt

#### Defined in

sdk/src/types/client.ts:187

---

### createAllowlist

• **createAllowlist**: (`allowList`: [`AllowlistEntry`](../modules.md#allowlistentry)[], `metaData`: [`HypercertMetadata`](HypercertMetadata.md), `totalUnits`: `bigint`, `transferRestriction`: [`TransferRestrictions`](../modules.md#transferrestrictions-1)) => `Promise`\<\`0x$\{string}\`\>

#### Type declaration

▸ (`allowList`, `metaData`, `totalUnits`, `transferRestriction`): `Promise`\<\`0x$\{string}\`\>

Creates a new allowlist and mints a new claim with the allowlist.

##### Parameters

| Name                  | Type                                                           | Description                              |
| :-------------------- | :------------------------------------------------------------- | :--------------------------------------- |
| `allowList`           | [`AllowlistEntry`](../modules.md#allowlistentry)[]             | The allowlist for the claim.             |
| `metaData`            | [`HypercertMetadata`](HypercertMetadata.md)                    | The metadata for the claim.              |
| `totalUnits`          | `bigint`                                                       | The total number of units for the claim. |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restriction for the claim.  |

##### Returns

`Promise`\<\`0x$\{string}\`\>

A Promise that resolves to the transaction receipt

#### Defined in

sdk/src/types/client.ts:160

---

### mergeFractionUnits

• **mergeFractionUnits**: (`fractionIds`: `bigint`[]) => `Promise`\<\`0x$\{string}\`\>

#### Type declaration

▸ (`fractionIds`): `Promise`\<\`0x$\{string}\`\>

Merges multiple claim fractions into a single claim.

##### Parameters

| Name          | Type       | Description                              |
| :------------ | :--------- | :--------------------------------------- |
| `fractionIds` | `bigint`[] | The IDs of the claim fractions to merge. |

##### Returns

`Promise`\<\`0x$\{string}\`\>

A Promise that resolves to the transaction receipt

#### Defined in

sdk/src/types/client.ts:180

---

### mintClaim

• **mintClaim**: (`metaData`: [`HypercertMetadata`](HypercertMetadata.md), `totalUnits`: `bigint`, `transferRestriction`: [`TransferRestrictions`](../modules.md#transferrestrictions-1)) => `Promise`\<\`0x$\{string}\`\>

#### Type declaration

▸ (`metaData`, `totalUnits`, `transferRestriction`): `Promise`\<\`0x$\{string}\`\>

Mints a new claim.

##### Parameters

| Name                  | Type                                                           | Description                              |
| :-------------------- | :------------------------------------------------------------- | :--------------------------------------- |
| `metaData`            | [`HypercertMetadata`](HypercertMetadata.md)                    | The metadata for the claim.              |
| `totalUnits`          | `bigint`                                                       | The total number of units for the claim. |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restriction for the claim.  |

##### Returns

`Promise`\<\`0x$\{string}\`\>

A Promise that resolves to the transaction receipt

#### Defined in

sdk/src/types/client.ts:146

---

### mintClaimFractionFromAllowlist

• **mintClaimFractionFromAllowlist**: (`claimId`: `bigint`, `units`: `bigint`, `proof`: (\`0x$\{string}\` \| `Uint8Array`)[]) => `Promise`\<\`0x$\{string}\`\>

#### Type declaration

▸ (`claimId`, `units`, `proof`): `Promise`\<\`0x$\{string}\`\>

Mints a claim fraction from an allowlist.

##### Parameters

| Name      | Type                                 | Description                                 |
| :-------- | :----------------------------------- | :------------------------------------------ |
| `claimId` | `bigint`                             | The ID of the claim to mint a fraction for. |
| `units`   | `bigint`                             | The number of units for the fraction.       |
| `proof`   | (\`0x$\{string}\` \| `Uint8Array`)[] | The Merkle proof for the allowlist.         |

##### Returns

`Promise`\<\`0x$\{string}\`\>

A Promise that resolves to the transaction receipt

#### Defined in

sdk/src/types/client.ts:196

---

### splitFractionUnits

• **splitFractionUnits**: (`fractionId`: `bigint`, `fractions`: `bigint`[]) => `Promise`\<\`0x$\{string}\`\>

#### Type declaration

▸ (`fractionId`, `fractions`): `Promise`\<\`0x$\{string}\`\>

Splits a claim into multiple fractions.

##### Parameters

| Name         | Type       | Description                   |
| :----------- | :--------- | :---------------------------- |
| `fractionId` | `bigint`   | The ID of the claim to split. |
| `fractions`  | `bigint`[] | -                             |

##### Returns

`Promise`\<\`0x$\{string}\`\>

A Promise that resolves to the transaction receipt

#### Defined in

sdk/src/types/client.ts:173
