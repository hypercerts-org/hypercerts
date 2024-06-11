---
id: "HypercertClientInterface"
title: "Interface: HypercertClientInterface"
sidebar_label: "HypercertClientInterface"
sidebar_position: 0
custom_edit_url: null
---

The interface for the Hypercert client.

## Hierarchy

- [`HypercertClientMethods`](HypercertClientMethods.md)

- [`HypercertClientState`](HypercertClientState.md)

  ↳ **`HypercertClientInterface`**

## Implemented by

- [`HypercertClient`](../classes/HypercertClient.md)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[batchMintClaimFractionsFromAllowlists](HypercertClientMethods.md#batchmintclaimfractionsfromallowlists)

#### Defined in

[sdk/src/types/client.ts:291](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L291)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[batchTransferFractions](HypercertClientMethods.md#batchtransferfractions)

#### Defined in

[sdk/src/types/client.ts:225](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L225)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[burnClaimFraction](HypercertClientMethods.md#burnclaimfraction)

#### Defined in

[sdk/src/types/client.ts:266](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L266)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[createAllowlist](HypercertClientMethods.md#createallowlist)

#### Defined in

[sdk/src/types/client.ts:239](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L239)

---

### getDeployments

• **getDeployments**: (`chainId`: [`SupportedChainIds`](../modules.md#supportedchainids)) => `Partial`<[`Deployment`](../modules.md#deployment)\>

#### Type declaration

▸ (`chainId`): `Partial`<[`Deployment`](../modules.md#deployment)\>

Gets the contract addresses and graph urls for the provided `chainId`

##### Parameters

| Name      | Type                                                   |
| :-------- | :----------------------------------------------------- |
| `chainId` | [`SupportedChainIds`](../modules.md#supportedchainids) |

##### Returns

`Partial`<[`Deployment`](../modules.md#deployment)\>

The addresses, graph name and graph url.

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[getDeployments](HypercertClientMethods.md#getdeployments)

#### Defined in

[sdk/src/types/client.ts:183](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L183)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[getTransferRestrictions](HypercertClientMethods.md#gettransferrestrictions)

#### Defined in

[sdk/src/types/client.ts:203](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L203)

---

### indexer

• **indexer**: `HypercertIndexer`

The indexer used by the client.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[indexer](HypercertClientState.md#indexer)

#### Defined in

[sdk/src/types/client.ts:172](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L172)

---

### isClaimOrFractionOnConnectedChain

• **isClaimOrFractionOnConnectedChain**: (`claimOrFractionId`: `string`) => `boolean`

#### Type declaration

▸ (`claimOrFractionId`): `boolean`

Check if a claim or fraction is on the chain that the Hypercertclient
is currently connected to

##### Parameters

| Name                | Type     | Description                               |
| :------------------ | :------- | :---------------------------------------- |
| `claimOrFractionId` | `string` | The ID of the claim or fraction to check. |

##### Returns

`boolean`

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[isClaimOrFractionOnConnectedChain](HypercertClientMethods.md#isclaimorfractiononconnectedchain)

#### Defined in

[sdk/src/types/client.ts:302](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L302)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mergeFractionUnits](HypercertClientMethods.md#mergefractionunits)

#### Defined in

[sdk/src/types/client.ts:259](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L259)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mintClaim](HypercertClientMethods.md#mintclaim)

#### Defined in

[sdk/src/types/client.ts:192](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L192)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[mintClaimFractionFromAllowlist](HypercertClientMethods.md#mintclaimfractionfromallowlist)

#### Defined in

[sdk/src/types/client.ts:275](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L275)

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[readonly](HypercertClientState.md#readonly)

#### Defined in

[sdk/src/types/client.ts:168](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L168)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[splitFractionUnits](HypercertClientMethods.md#splitfractionunits)

#### Defined in

[sdk/src/types/client.ts:252](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L252)

---

### storage

• **storage**: [`HypercertStorageInterface`](HypercertStorageInterface.md)

The storage layer used by the client.

#### Inherited from

[HypercertClientState](HypercertClientState.md).[storage](HypercertClientState.md#storage)

#### Defined in

[sdk/src/types/client.ts:170](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L170)

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

#### Inherited from

[HypercertClientMethods](HypercertClientMethods.md).[transferFraction](HypercertClientMethods.md#transferfraction)

#### Defined in

[sdk/src/types/client.ts:212](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L212)
