[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [client](../modules/client.md) / default

# Class: default

[client](../modules/client.md).default

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

- [`HypercertClientInterface`](../interfaces/types_client.HypercertClientInterface.md)

## Table of contents

### Constructors

- [constructor](client.default.md#constructor)

### Properties

- [config](client.default.md#config)
- [contract](client.default.md#contract)
- [provider](client.default.md#provider)
- [readonly](client.default.md#readonly)
- [signer](client.default.md#signer)
- [storage](client.default.md#storage)

### Methods

- [burnClaimFraction](client.default.md#burnclaimfraction)
- [createAllowlist](client.default.md#createallowlist)
- [mergeClaimUnits](client.default.md#mergeclaimunits)
- [mintClaim](client.default.md#mintclaim)
- [mintClaimFractionFromAllowlist](client.default.md#mintclaimfractionfromallowlist)
- [splitClaimUnits](client.default.md#splitclaimunits)

## Constructors

### constructor

• **new default**(`«destructured»`)

#### Parameters

| Name             | Type                                                                      |
| :--------------- | :------------------------------------------------------------------------ |
| `«destructured»` | [`HypercertClientProps`](../modules/types_client.md#hypercertclientprops) |

#### Defined in

[sdk/src/client.ts:29](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L29)

## Properties

### config

• **config**: [`HypercertClientConfig`](../modules/types_client.md#hypercertclientconfig)

#### Implementation of

[HypercertClientInterface](../interfaces/types_client.HypercertClientInterface.md).[config](../interfaces/types_client.HypercertClientInterface.md#config)

#### Defined in

[sdk/src/client.ts:22](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L22)

---

### contract

• **contract**: `HypercertMinter$1`

#### Implementation of

[HypercertClientInterface](../interfaces/types_client.HypercertClientInterface.md).[contract](../interfaces/types_client.HypercertClientInterface.md#contract)

#### Defined in

[sdk/src/client.ts:26](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L26)

---

### provider

• **provider**: `Provider`

#### Implementation of

[HypercertClientInterface](../interfaces/types_client.HypercertClientInterface.md).[provider](../interfaces/types_client.HypercertClientInterface.md#provider)

#### Defined in

[sdk/src/client.ts:24](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L24)

---

### readonly

• **readonly**: `boolean`

#### Implementation of

[HypercertClientInterface](../interfaces/types_client.HypercertClientInterface.md).[readonly](../interfaces/types_client.HypercertClientInterface.md#readonly)

#### Defined in

[sdk/src/client.ts:27](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L27)

---

### signer

• `Optional` **signer**: `Signer`

#### Defined in

[sdk/src/client.ts:25](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L25)

---

### storage

• **storage**: [`default`](storage.default.md)

#### Implementation of

[HypercertClientInterface](../interfaces/types_client.HypercertClientInterface.md).[storage](../interfaces/types_client.HypercertClientInterface.md#storage)

#### Defined in

[sdk/src/client.ts:23](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L23)

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

[sdk/src/client.ts:188](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L188)

---

### createAllowlist

▸ **createAllowlist**(`allowList`, `metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

Create a Hypercert claim with an allowlist

**`Dev`**

Mints a Hypercert claim with the given metadata, total units, transfer restrictions and allowlist

**`Notice`**

The total number of units in the allowlist must match the total number of units for the Hypercert

#### Parameters

| Name                  | Type                                                                        | Description                             |
| :-------------------- | :-------------------------------------------------------------------------- | :-------------------------------------- |
| `allowList`           | [`Allowlist`](../modules/types_hypercerts.md#allowlist)                     | Allowlist for the Hypercert             |
| `metaData`            | [`HypercertMetadata`](../interfaces/types_metadata.HypercertMetadata.md)    | Hypercert metadata                      |
| `totalUnits`          | `BigNumberish`                                                              | Total number of units for the Hypercert |
| `transferRestriction` | [`TransferRestrictions`](../enums/types_hypercerts.TransferRestrictions.md) | Transfer restrictions for the Hypercert |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.createAllowlist

#### Defined in

[sdk/src/client.ts:90](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L90)

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

[sdk/src/client.ts:164](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L164)

---

### mintClaim

▸ **mintClaim**(`metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

Mint a Hypercert claim

**`Dev`**

Mints a Hypercert claim with the given metadata, total units and transfer restrictions

#### Parameters

| Name                  | Type                                                                        | Description                             |
| :-------------------- | :-------------------------------------------------------------------------- | :-------------------------------------- |
| `metaData`            | [`HypercertMetadata`](../interfaces/types_metadata.HypercertMetadata.md)    | Hypercert metadata                      |
| `totalUnits`          | `BigNumberish`                                                              | Total number of units for the Hypercert |
| `transferRestriction` | [`TransferRestrictions`](../enums/types_hypercerts.TransferRestrictions.md) | Transfer restrictions for the Hypercert |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.mintClaim

#### Defined in

[sdk/src/client.ts:60](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L60)

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

[sdk/src/client.ts:210](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L210)

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

[sdk/src/client.ts:139](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/client.ts#L139)
