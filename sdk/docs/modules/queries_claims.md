[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / queries/claims

# Module: queries/claims

## Table of contents

### Functions

- [claimById](queries_claims.md#claimbyid)
- [claimsByOwner](queries_claims.md#claimsbyowner)
- [firstClaims](queries_claims.md#firstclaims)

## Functions

### claimById

▸ **claimById**(`id`): `Promise`<[`ClaimByIdQuery`](global.md#claimbyidquery)\>

#### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

#### Returns

`Promise`<[`ClaimByIdQuery`](global.md#claimbyidquery)\>

#### Defined in

[sdk/src/queries/claims.ts:14](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/queries/claims.ts#L14)

---

### claimsByOwner

▸ **claimsByOwner**(`owner`): `Promise`<`ClaimsByOwnerQuery`\>

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `owner` | `string` |

#### Returns

`Promise`<`ClaimsByOwnerQuery`\>

#### Defined in

[sdk/src/queries/claims.ts:9](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/queries/claims.ts#L9)

---

### firstClaims

▸ **firstClaims**(`first`): `Promise`<`RecentClaimsQuery`\>

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `first` | `number` |

#### Returns

`Promise`<`RecentClaimsQuery`\>

#### Defined in

[sdk/src/queries/claims.ts:19](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/queries/claims.ts#L19)
