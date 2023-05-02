[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/client](../modules/types_client.md) / HypercertClientMethods

# Interface: HypercertClientMethods

[types/client](../modules/types_client.md).HypercertClientMethods

## Table of contents

### Properties

- [burnClaimFraction](types_client.HypercertClientMethods.md#burnclaimfraction)
- [createAllowlist](types_client.HypercertClientMethods.md#createallowlist)
- [mergeClaimUnits](types_client.HypercertClientMethods.md#mergeclaimunits)
- [mintClaim](types_client.HypercertClientMethods.md#mintclaim)
- [mintClaimFractionFromAllowlist](types_client.HypercertClientMethods.md#mintclaimfractionfromallowlist)
- [splitClaimUnits](types_client.HypercertClientMethods.md#splitclaimunits)

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

[sdk/src/types/client.ts:114](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L114)

---

### createAllowlist

• **createAllowlist**: (`allowList`: [`Allowlist`](../modules/types_hypercerts.md#allowlist), `metaData`: [`HypercertMetadata`](types_metadata.HypercertMetadata.md), `totalUnits`: `BigNumberish`, `transferRestriction`: [`TransferRestrictions`](../enums/types_hypercerts.TransferRestrictions.md)) => `Promise`<`ContractTransaction`\>

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

[sdk/src/types/client.ts:106](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L106)

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

[sdk/src/types/client.ts:113](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L113)

---

### mintClaim

• **mintClaim**: (`metaData`: [`HypercertMetadata`](types_metadata.HypercertMetadata.md), `totalUnits`: `BigNumberish`, `transferRestriction`: [`TransferRestrictions`](../enums/types_hypercerts.TransferRestrictions.md)) => `Promise`<`ContractTransaction`\>

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

[sdk/src/types/client.ts:101](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L101)

---

### mintClaimFractionFromAllowlist

• **mintClaimFractionFromAllowlist**: (`claimId`: `BigNumberish`, `units`: `BigNumberish`, `proof`: `BytesLike`[]) => `Promise`<`ContractTransaction`\>

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

[sdk/src/types/client.ts:115](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L115)

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

[sdk/src/types/client.ts:112](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L112)
