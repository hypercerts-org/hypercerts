[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/client](../modules/types_client.md) /
HypercertClientInterface

# Interface: HypercertClientInterface

[types/client](../modules/types_client.md).HypercertClientInterface

Hypercerts client interface

**`Param`**

Indicates if the client is readonly

**`Param`**

Hypercerts client configuration

**`Param`**

Ethers provider

**`Param`**

Hypercerts contract

**`Param`**

Hypercerts storage

**`Param`**

Wrapper function to mint a Hypercert claim

**`Param`**

Wrapper function to mint a Hypercert claim with an allowlist

**`Param`**

Wrapper function to split a Hypercert claim into multiple claims

**`Param`**

Wrapper function to merge multiple Hypercert claims into one

**`Param`**

Wrapper function to burn a fraction of a Hypercert claim

**`Param`**

Wrapper function to mint a fraction of a Hypercert claim from an allowlist

## Implemented by

- [`default`](../classes/client.default.md)

## Table of contents

### Properties

- [burnClaimFraction](types_client.HypercertClientInterface.md#burnclaimfraction)
- [config](types_client.HypercertClientInterface.md#config)
- [contract](types_client.HypercertClientInterface.md#contract)
- [createAllowlist](types_client.HypercertClientInterface.md#createallowlist)
- [mergeClaimUnits](types_client.HypercertClientInterface.md#mergeclaimunits)
- [mintClaim](types_client.HypercertClientInterface.md#mintclaim)
- [mintClaimFractionFromAllowlist](types_client.HypercertClientInterface.md#mintclaimfractionfromallowlist)
- [provider](types_client.HypercertClientInterface.md#provider)
- [readonly](types_client.HypercertClientInterface.md#readonly)
- [splitClaimUnits](types_client.HypercertClientInterface.md#splitclaimunits)
- [storage](types_client.HypercertClientInterface.md#storage)

## Properties

### burnClaimFraction

• **burnClaimFraction**: (`claimId`: `BigNumberish`) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimId`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name      | Type           |
| :-------- | :------------- |
| `claimId` | `BigNumberish` |

##### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

[sdk/src/types/client.ts:92](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L92)

---

### config

• **config**: [`HypercertClientConfig`](../modules/types_client.md#hypercertclientconfig)

#### Defined in

[sdk/src/types/client.ts:75](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L75)

---

### contract

• **contract**: `HypercertMinter$1`

#### Defined in

[sdk/src/types/client.ts:77](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L77)

---

### createAllowlist

• **createAllowlist**: (`allowList`: [`Allowlist`](../modules/types_hypercerts.md#allowlist), `metaData`:
[`HypercertMetadata`](types_metadata.HypercertMetadata.md), `totalUnits`: `BigNumberish`, `transferRestriction`:
[`TransferRestrictions`](../enums/types_hypercerts.TransferRestrictions.md)) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`allowList`, `metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name                  | Type                                                                        |
| :-------------------- | :-------------------------------------------------------------------------- |
| `allowList`           | [`Allowlist`](../modules/types_hypercerts.md#allowlist)                     |
| `metaData`            | [`HypercertMetadata`](types_metadata.HypercertMetadata.md)                  |
| `totalUnits`          | `BigNumberish`                                                              |
| `transferRestriction` | [`TransferRestrictions`](../enums/types_hypercerts.TransferRestrictions.md) |

##### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

[sdk/src/types/client.ts:84](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L84)

---

### mergeClaimUnits

• **mergeClaimUnits**: (`claimIds`: `BigNumberish`[]) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimIds`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name       | Type             |
| :--------- | :--------------- |
| `claimIds` | `BigNumberish`[] |

##### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

[sdk/src/types/client.ts:91](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L91)

---

### mintClaim

• **mintClaim**: (`metaData`: [`HypercertMetadata`](types_metadata.HypercertMetadata.md), `totalUnits`: `BigNumberish`,
`transferRestriction`: [`TransferRestrictions`](../enums/types_hypercerts.TransferRestrictions.md)) =>
`Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`metaData`, `totalUnits`, `transferRestriction`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name                  | Type                                                                        |
| :-------------------- | :-------------------------------------------------------------------------- |
| `metaData`            | [`HypercertMetadata`](types_metadata.HypercertMetadata.md)                  |
| `totalUnits`          | `BigNumberish`                                                              |
| `transferRestriction` | [`TransferRestrictions`](../enums/types_hypercerts.TransferRestrictions.md) |

##### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

[sdk/src/types/client.ts:79](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L79)

---

### mintClaimFractionFromAllowlist

• **mintClaimFractionFromAllowlist**: (`claimId`: `BigNumberish`, `units`: `BigNumberish`, `proof`: `BytesLike`[]) =>
`Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimId`, `units`, `proof`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name      | Type           |
| :-------- | :------------- |
| `claimId` | `BigNumberish` |
| `units`   | `BigNumberish` |
| `proof`   | `BytesLike`[]  |

##### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

[sdk/src/types/client.ts:93](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L93)

---

### provider

• **provider**: `Provider`

#### Defined in

[sdk/src/types/client.ts:76](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L76)

---

### readonly

• **readonly**: `boolean`

#### Defined in

[sdk/src/types/client.ts:74](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L74)

---

### splitClaimUnits

• **splitClaimUnits**: (`claimId`: `BigNumberish`, `fractions`: `BigNumberish`[]) => `Promise`<`ContractTransaction`\>

#### Type declaration

▸ (`claimId`, `fractions`): `Promise`<`ContractTransaction`\>

##### Parameters

| Name        | Type             |
| :---------- | :--------------- |
| `claimId`   | `BigNumberish`   |
| `fractions` | `BigNumberish`[] |

##### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

[sdk/src/types/client.ts:90](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L90)

---

### storage

• **storage**: [`default`](../classes/storage.default.md)

#### Defined in

[sdk/src/types/client.ts:78](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L78)
