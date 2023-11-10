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

- [batchMintClaimFractionsFromAllowlists](HypercertClientInterface.md#batchmintclaimfractionsfromallowlists)
- [burnClaimFraction](HypercertClientInterface.md#burnclaimfraction)
- [contract](HypercertClientInterface.md#contract)
- [createAllowlist](HypercertClientInterface.md#createallowlist)
- [indexer](HypercertClientInterface.md#indexer)
- [mergeFractionUnits](HypercertClientInterface.md#mergefractionunits)
- [mintClaim](HypercertClientInterface.md#mintclaim)
- [mintClaimFractionFromAllowlist](HypercertClientInterface.md#mintclaimfractionfromallowlist)
- [readonly](HypercertClientInterface.md#readonly)
- [splitFractionUnits](HypercertClientInterface.md#splitfractionunits)
- [storage](HypercertClientInterface.md#storage)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[batchMintClaimFractionsFromAllowlists](HypercertClientMethods.md#batchmintclaimfractionsfromallowlists)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[burnClaimFraction](HypercertClientMethods.md#burnclaimfraction)

#### Defined in

sdk/src/types/client.ts:187

---

### contract

• **contract**: `Object`

#### Type declaration

| Name       | Type             |
| :--------- | :--------------- |
| `abi`      | `Abi`            |
| `address?` | \`0x$\{string}\` |

#### Inherited from

[HypercertClientState](HypercertClientState.md).[contract](HypercertClientState.md#contract)

#### Defined in

sdk/src/types/client.ts:132

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[createAllowlist](HypercertClientMethods.md#createallowlist)

#### Defined in

sdk/src/types/client.ts:160

---

### indexer

• **indexer**: [`default`](../classes/internal.default-1.md)

The indexer used by the client.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[indexer](HypercertClientState.md#indexer)

#### Defined in

sdk/src/types/client.ts:131

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mergeFractionUnits](HypercertClientMethods.md#mergefractionunits)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mintClaim](HypercertClientMethods.md#mintclaim)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mintClaimFractionFromAllowlist](HypercertClientMethods.md#mintclaimfractionfromallowlist)

#### Defined in

sdk/src/types/client.ts:196

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[readonly](HypercertClientState.md#readonly)

#### Defined in

sdk/src/types/client.ts:127

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[splitFractionUnits](HypercertClientMethods.md#splitfractionunits)

#### Defined in

sdk/src/types/client.ts:173

---

### storage

• **storage**: [`HypercertStorageInterface`](HypercertStorageInterface.md)

The storage layer used by the client.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[storage](HypercertClientState.md#storage)

#### Defined in

sdk/src/types/client.ts:129
