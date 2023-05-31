[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertIndexerInterface

# Interface: HypercertIndexerInterface

## Table of contents

### Properties

- [claimById](HypercertIndexerInterface.md#claimbyid)
- [claimsByOwner](HypercertIndexerInterface.md#claimsbyowner)
- [firstClaims](HypercertIndexerInterface.md#firstclaims)
- [fractionById](HypercertIndexerInterface.md#fractionbyid)
- [fractionsByClaim](HypercertIndexerInterface.md#fractionsbyclaim)
- [fractionsByOwner](HypercertIndexerInterface.md#fractionsbyowner)
- [graphClient](HypercertIndexerInterface.md#graphclient)

## Properties

### claimById

• **claimById**: (`id`: `string`) => `Promise`<`ClaimByIdQuery`\>

#### Type declaration

▸ (`id`): `Promise`<`ClaimByIdQuery`\>

##### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

##### Returns

`Promise`<`ClaimByIdQuery`\>

#### Defined in

[sdk/src/types/indexer.ts:20](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/indexer.ts#L20)

---

### claimsByOwner

• **claimsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`ClaimsByOwnerQuery`\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`<`ClaimsByOwnerQuery`\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`ClaimsByOwnerQuery`\>

#### Defined in

[sdk/src/types/indexer.ts:19](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/indexer.ts#L19)

---

### firstClaims

• **firstClaims**: (`params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`RecentClaimsQuery`\>

#### Type declaration

▸ (`params?`): `Promise`<`RecentClaimsQuery`\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`RecentClaimsQuery`\>

#### Defined in

[sdk/src/types/indexer.ts:21](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/indexer.ts#L21)

---

### fractionById

• **fractionById**: (`fractionId`: `string`) => `Promise`<`ClaimTokenByIdQuery`\>

#### Type declaration

▸ (`fractionId`): `Promise`<`ClaimTokenByIdQuery`\>

##### Parameters

| Name         | Type     |
| :----------- | :------- |
| `fractionId` | `string` |

##### Returns

`Promise`<`ClaimTokenByIdQuery`\>

#### Defined in

[sdk/src/types/indexer.ts:24](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/indexer.ts#L24)

---

### fractionsByClaim

• **fractionsByClaim**: (`claimId`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`ClaimTokensByClaimQuery`\>

#### Type declaration

▸ (`claimId`, `params?`): `Promise`<`ClaimTokensByClaimQuery`\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `claimId` | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`ClaimTokensByClaimQuery`\>

#### Defined in

[sdk/src/types/indexer.ts:23](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/indexer.ts#L23)

---

### fractionsByOwner

• **fractionsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`ClaimTokensByOwnerQuery`\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`<`ClaimTokensByOwnerQuery`\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`ClaimTokensByOwnerQuery`\>

#### Defined in

[sdk/src/types/indexer.ts:22](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/indexer.ts#L22)

---

### graphClient

• **graphClient**: `any`

#### Defined in

[sdk/src/types/indexer.ts:18](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/indexer.ts#L18)
