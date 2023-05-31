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

- [`HypercertClientInterface`](../interfaces/HypercertClientInterface.md)

## Table of contents

### Constructors

- [constructor](HypercertClient.md#constructor)

### Properties

- [\_config](HypercertClient.md#_config)
- [\_contract](HypercertClient.md#_contract)
- [\_evaluator](HypercertClient.md#_evaluator)
- [\_indexer](HypercertClient.md#_indexer)
- [\_provider](HypercertClient.md#_provider)
- [\_signer](HypercertClient.md#_signer)
- [\_storage](HypercertClient.md#_storage)
- [readonly](HypercertClient.md#readonly)

### Accessors

- [contract](HypercertClient.md#contract)
- [indexer](HypercertClient.md#indexer)
- [storage](HypercertClient.md#storage)

### Methods

- [burnClaimFraction](HypercertClient.md#burnclaimfraction)
- [checkWritable](HypercertClient.md#checkwritable)
- [createAllowlist](HypercertClient.md#createallowlist)
- [mergeClaimUnits](HypercertClient.md#mergeclaimunits)
- [mintClaim](HypercertClient.md#mintclaim)
- [mintClaimFractionFromAllowlist](HypercertClient.md#mintclaimfractionfromallowlist)
- [splitClaimUnits](HypercertClient.md#splitclaimunits)

## Constructors

### constructor

• **new HypercertClient**(`config?`)

Creates a new instance of the `HypercertClient` class.

#### Parameters

| Name     | Type                                                                       | Description                               |
| :------- | :------------------------------------------------------------------------- | :---------------------------------------- |
| `config` | `Partial`<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\> | The configuration options for the client. |

#### Defined in

[sdk/src/client.ts:49](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L49)

## Properties

### \_config

• `Private` **\_config**: [`HypercertClientConfig`](../modules.md#hypercertclientconfig)

#### Defined in

[sdk/src/client.ts:35](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L35)

---

### \_contract

• `Private` **\_contract**: [`HypercertMinter`](../interfaces/HypercertMinter.md)

#### Defined in

[sdk/src/client.ts:42](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L42)

---

### \_evaluator

• `Private` **\_evaluator**: `default`

#### Defined in

[sdk/src/client.ts:37](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L37)

---

### \_indexer

• `Private` **\_indexer**: `default`

#### Defined in

[sdk/src/client.ts:38](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L38)

---

### \_provider

• `Private` **\_provider**: `Provider`

#### Defined in

[sdk/src/client.ts:39](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L39)

---

### \_signer

• `Private` `Optional` **\_signer**: `Signer`

#### Defined in

[sdk/src/client.ts:41](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L41)

---

### \_storage

• `Private` **\_storage**: `default`

#### Defined in

[sdk/src/client.ts:36](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L36)

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[readonly](../interfaces/HypercertClientInterface.md#readonly)

#### Defined in

[sdk/src/client.ts:43](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L43)

## Accessors

### contract

• `get` **contract**(): [`HypercertMinter`](../interfaces/HypercertMinter.md)

Gets the HypercertMinter contract used by the client.

#### Returns

[`HypercertMinter`](../interfaces/HypercertMinter.md)

The contract.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[contract](../interfaces/HypercertClientInterface.md#contract)

#### Defined in

[sdk/src/client.ts:91](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L91)

---

### indexer

• `get` **indexer**(): `default`

Gets the indexer for the client.

#### Returns

`default`

The indexer.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[indexer](../interfaces/HypercertClientInterface.md#indexer)

#### Defined in

[sdk/src/client.ts:83](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L83)

---

### storage

• `get` **storage**(): `default`

Gets the storage layer for the client.

#### Returns

`default`

The storage layer.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[storage](../interfaces/HypercertClientInterface.md#storage)

#### Defined in

[sdk/src/client.ts:75](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L75)

## Methods

### burnClaimFraction

▸ **burnClaimFraction**(`claimId`, `overrides?`): `Promise`<`ContractTransaction`\>

Burn a Hypercert claim by providing the claim id

**`Dev`**

Burns a Hypercert claim

#### Parameters

| Name         | Type           | Description        |
| :----------- | :------------- | :----------------- |
| `claimId`    | `BigNumberish` | Hypercert claim id |
| `overrides?` | `Overrides`    | -                  |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.burnClaimFraction

#### Defined in

[sdk/src/client.ts:244](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L244)

---

### checkWritable

▸ `Private` **checkWritable**(): `void`

#### Returns

`void`

#### Defined in

[sdk/src/client.ts:294](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L294)

---

### createAllowlist

▸ **createAllowlist**(`allowList`, `metaData`, `totalUnits`, `transferRestriction`, `overrides?`): `Promise`<`ContractTransaction`\>

Create a Hypercert claim with an allowlist

**`Dev`**

Mints a Hypercert claim with the given metadata, total units, transfer restrictions and allowlist

**`Notice`**

The total number of units in the allowlist must match the total number of units for the Hypercert

#### Parameters

| Name                  | Type                                                           | Description                             |
| :-------------------- | :------------------------------------------------------------- | :-------------------------------------- |
| `allowList`           | [`Allowlist`](../modules.md#allowlist)                         | Allowlist for the Hypercert             |
| `metaData`            | [`HypercertMetadata`](../interfaces/HypercertMetadata.md)      | Hypercert metadata                      |
| `totalUnits`          | `BigNumberish`                                                 | Total number of units for the Hypercert |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | Transfer restrictions for the Hypercert |
| `overrides?`          | `Overrides`                                                    | -                                       |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.createAllowlist

#### Defined in

[sdk/src/client.ts:135](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L135)

---

### mergeClaimUnits

▸ **mergeClaimUnits**(`claimIds`, `overrides?`): `Promise`<`ContractTransaction`\>

Merge multiple Hypercert claims fractions into one

**`Dev`**

Merges multiple Hypercert claims into one

#### Parameters

| Name         | Type             | Description         |
| :----------- | :--------------- | :------------------ |
| `claimIds`   | `BigNumberish`[] | Hypercert claim ids |
| `overrides?` | `Overrides`      | -                   |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.mergeClaimUnits

#### Defined in

[sdk/src/client.ts:219](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L219)

---

### mintClaim

▸ **mintClaim**(`metaData`, `totalUnits`, `transferRestriction`, `overrides?`): `Promise`<`ContractTransaction`\>

Mint a Hypercert claim

**`Dev`**

Mints a Hypercert claim with the given metadata, total units and transfer restrictions

#### Parameters

| Name                  | Type                                                           | Description                             |
| :-------------------- | :------------------------------------------------------------- | :-------------------------------------- |
| `metaData`            | [`HypercertMetadata`](../interfaces/HypercertMetadata.md)      | Hypercert metadata                      |
| `totalUnits`          | `BigNumberish`                                                 | Total number of units for the Hypercert |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | Transfer restrictions for the Hypercert |
| `overrides?`          | `Overrides`                                                    | -                                       |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.mintClaim

#### Defined in

[sdk/src/client.ts:103](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L103)

---

### mintClaimFractionFromAllowlist

▸ **mintClaimFractionFromAllowlist**(`claimId`, `units`, `proof`, `root?`, `overrides?`): `Promise`<`ContractTransaction`\>

Mint a Hypercert claim fraction from an allowlist.

**`Dev`**

Verifies the claim proof and mints the claim fraction

**`Notice`**

If known, provide the root for client side verification

#### Parameters

| Name         | Type           | Description                |
| :----------- | :------------- | :------------------------- |
| `claimId`    | `BigNumberish` | Hypercert claim id         |
| `units`      | `BigNumberish` | Number of units to mint    |
| `proof`      | `BytesLike`[]  | Merkle proof for the claim |
| `root?`      | `BytesLike`    | -                          |
| `overrides?` | `Overrides`    | -                          |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.mintClaimFractionFromAllowlist

#### Defined in

[sdk/src/client.ts:267](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L267)

---

### splitClaimUnits

▸ **splitClaimUnits**(`claimId`, `fractions`, `overrides?`): `Promise`<`ContractTransaction`\>

Split a Hypercert's unit into multiple claims with the given fractions

**`Dev`**

Submit the ID of the claim to split and new fraction values.

**`Notice`**

The sum of the fractions must be equal to the total units of the claim

#### Parameters

| Name         | Type             | Description                               |
| :----------- | :--------------- | :---------------------------------------- |
| `claimId`    | `BigNumberish`   | Hypercert claim id                        |
| `fractions`  | `BigNumberish`[] | Fractions of the Hypercert claim to split |
| `overrides?` | `Overrides`      | -                                         |

#### Returns

`Promise`<`ContractTransaction`\>

Contract transaction

#### Implementation of

HypercertClientInterface.splitClaimUnits

#### Defined in

[sdk/src/client.ts:193](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/client.ts#L193)
