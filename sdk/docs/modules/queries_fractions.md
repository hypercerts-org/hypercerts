[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / queries/fractions

# Module: queries/fractions

## Table of contents

### Functions

- [fractionById](queries_fractions.md#fractionbyid)
- [fractionsByClaim](queries_fractions.md#fractionsbyclaim)
- [fractionsByOwner](queries_fractions.md#fractionsbyowner)

## Functions

### fractionById

▸ **fractionById**(`fractionId`): `Promise`<`ClaimTokenByIdQuery`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `fractionId` | `string` |

#### Returns

`Promise`<`ClaimTokenByIdQuery`\>

#### Defined in

[sdk/src/queries/fractions.ts:19](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/queries/fractions.ts#L19)

---

### fractionsByClaim

▸ **fractionsByClaim**(`claimId`): `Promise`<[`ClaimTokensByClaimQuery`](global.md#claimtokensbyclaimquery)\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `claimId` | `string` |

#### Returns

`Promise`<[`ClaimTokensByClaimQuery`](global.md#claimtokensbyclaimquery)\>

#### Defined in

[sdk/src/queries/fractions.ts:14](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/queries/fractions.ts#L14)

---

### fractionsByOwner

▸ **fractionsByOwner**(`owner`): `Promise`<`ClaimTokensByOwnerQuery`\>

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `owner` | `string` |

#### Returns

`Promise`<`ClaimTokensByOwnerQuery`\>

#### Defined in

[sdk/src/queries/fractions.ts:9](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/queries/fractions.ts#L9)
