[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertClient

# Class: HypercertClient

Hypercerts client factory

**`Dev`**

Creates a Hypercerts client instance

**`Notice`**

The client is readonly if no signer is set or if the contract address is not set

**`Param`**

Hypercerts client configuration

**`Param`**

Hypercerts storage object

## Implements

- `HypercertClientInterface`

## Table of contents

### Constructors

- [constructor](HypercertClient.md#constructor)

### Properties

- [config](HypercertClient.md#config)
- [contract](HypercertClient.md#contract)
- [provider](HypercertClient.md#provider)
- [readonly](HypercertClient.md#readonly)
- [signer](HypercertClient.md#signer)
- [storage](HypercertClient.md#storage)

### Methods

- [burnClaimFraction](HypercertClient.md#burnclaimfraction)
- [createAllowlist](HypercertClient.md#createallowlist)
- [mergeClaimUnits](HypercertClient.md#mergeclaimunits)
- [mintClaim](HypercertClient.md#mintclaim)
- [mintClaimFractionFromAllowlist](HypercertClient.md#mintclaimfractionfromallowlist)
- [splitClaimUnits](HypercertClient.md#splitclaimunits)

## Constructors

### constructor

• **new HypercertClient**(`«destructured»`)

#### Parameters

| Name             | Type                   |
| :--------------- | :--------------------- |
| `«destructured»` | `HypercertClientProps` |

#### Defined in

[sdk/src/client.ts:29](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L29)

## Properties

### config

• **config**: `HypercertClientConfig`

#### Implementation of

HypercertClientInterface.config

#### Defined in

[sdk/src/client.ts:22](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L22)

---

### contract

• **contract**: `HypercertMinter$1`

#### Implementation of

HypercertClientInterface.contract

#### Defined in

[sdk/src/client.ts:26](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L26)

---

### provider

• **provider**: `Provider`

#### Implementation of

HypercertClientInterface.provider

#### Defined in

[sdk/src/client.ts:24](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L24)

---

### readonly

• **readonly**: `boolean`

#### Implementation of

HypercertClientInterface.readonly

#### Defined in

[sdk/src/client.ts:27](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L27)

---

### signer

• `Optional` **signer**: `Signer`

#### Defined in

[sdk/src/client.ts:25](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L25)

---

### storage

• **storage**: `default`

#### Implementation of

HypercertClientInterface.storage

#### Defined in

[sdk/src/client.ts:23](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L23)

## Methods

### burnClaimFraction

▸ **burnClaimFraction**(`claimId`): `Promise`<`ContractTransaction`\>

Burn a Hypercert claim by providing the claim id

**`Dev`**

Burns a Hypercert claim

#### Parameters

| Name      | Type           | Description        |
| :-------- | :------------- | :----------------- |
| `claimId` | `BigNumberish` | Hypercert claim id |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.burnClaimFraction

#### Defined in

[sdk/src/client.ts:188](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L188)

---

### createAllowlist

▸ **createAllowlist**(`allowList`, `metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

Create a Hypercert claim with an allowlist

**`Dev`**

Mints a Hypercert claim with the given metadata, total units, transfer restrictions and allowlist

**`Notice`**

The total number of units in the allowlist must match the total number of units for the Hypercert

#### Parameters

| Name                  | Type                                                       | Description                             |
| :-------------------- | :--------------------------------------------------------- | :-------------------------------------- |
| `allowList`           | [`Allowlist`](../modules.md#allowlist)                     | Allowlist for the Hypercert             |
| `metaData`            | [`HypercertMetadata`](../interfaces/HypercertMetadata.md)  | Hypercert metadata                      |
| `totalUnits`          | `BigNumberish`                                             | Total number of units for the Hypercert |
| `transferRestriction` | [`TransferRestrictions`](../enums/TransferRestrictions.md) | Transfer restrictions for the Hypercert |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.createAllowlist

#### Defined in

[sdk/src/client.ts:90](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L90)

---

### mergeClaimUnits

▸ **mergeClaimUnits**(`claimIds`): `Promise`<`ContractTransaction`\>

Merge multiple Hypercert claims fractions into one

**`Dev`**

Merges multiple Hypercert claims into one

#### Parameters

| Name       | Type             | Description         |
| :--------- | :--------------- | :------------------ |
| `claimIds` | `BigNumberish`[] | Hypercert claim ids |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.mergeClaimUnits

#### Defined in

[sdk/src/client.ts:164](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L164)

---

### mintClaim

▸ **mintClaim**(`metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

Mint a Hypercert claim

**`Dev`**

Mints a Hypercert claim with the given metadata, total units and transfer restrictions

#### Parameters

| Name                  | Type                                                       | Description                             |
| :-------------------- | :--------------------------------------------------------- | :-------------------------------------- |
| `metaData`            | [`HypercertMetadata`](../interfaces/HypercertMetadata.md)  | Hypercert metadata                      |
| `totalUnits`          | `BigNumberish`                                             | Total number of units for the Hypercert |
| `transferRestriction` | [`TransferRestrictions`](../enums/TransferRestrictions.md) | Transfer restrictions for the Hypercert |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.mintClaim

#### Defined in

[sdk/src/client.ts:60](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L60)

---

### mintClaimFractionFromAllowlist

▸ **mintClaimFractionFromAllowlist**(`claimId`, `units`, `proof`, `root?`): `Promise`<`ContractTransaction`\>

Mint a Hypercert claim fraction from an allowlist.

**`Dev`**

Verifies the claim proof and mints the claim fraction

**`Notice`**

If known, provide the root for client side verification

#### Parameters

| Name      | Type           | Description                |
| :-------- | :------------- | :------------------------- |
| `claimId` | `BigNumberish` | Hypercert claim id         |
| `units`   | `BigNumberish` | Number of units to mint    |
| `proof`   | `BytesLike`[]  | Merkle proof for the claim |
| `root?`   | `BytesLike`    | -                          |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.mintClaimFractionFromAllowlist

#### Defined in

[sdk/src/client.ts:210](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L210)

---

### splitClaimUnits

▸ **splitClaimUnits**(`claimId`, `fractions`): `Promise`<`ContractTransaction`\>

Split a Hypercert's unit into multiple claims with the given fractions

**`Dev`**

Submit the ID of the claim to split and new fraction values.

**`Notice`**

The sum of the fractions must be equal to the total units of the claim

#### Parameters

| Name        | Type             | Description                               |
| :---------- | :--------------- | :---------------------------------------- |
| `claimId`   | `BigNumberish`   | Hypercert claim id                        |
| `fractions` | `BigNumberish`[] | Fractions of the Hypercert claim to split |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.splitClaimUnits

#### Defined in

[sdk/src/client.ts:139](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/client.ts#L139)
