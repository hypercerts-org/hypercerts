[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertIndexerInterface

# Interface: HypercertIndexerInterface

## Implemented by

- [`default`](../classes/internal.default-2.md)

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

• **claimById**: (`id`: `string`) => `Promise`<[`ClaimByIdQuery`](../modules/internal.md#claimbyidquery)\>

#### Type declaration

▸ (`id`): `Promise`<[`ClaimByIdQuery`](../modules/internal.md#claimbyidquery)\>

##### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

##### Returns

`Promise`<[`ClaimByIdQuery`](../modules/internal.md#claimbyidquery)\>

#### Defined in

[sdk/src/types/indexer.ts:20](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/indexer.ts#L20)

---

### claimsByOwner

• **claimsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>

#### Defined in

[sdk/src/types/indexer.ts:19](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/indexer.ts#L19)

---

### firstClaims

• **firstClaims**: (`params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>

#### Type declaration

▸ (`params?`): `Promise`<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>

#### Defined in

[sdk/src/types/indexer.ts:21](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/indexer.ts#L21)

---

### fractionById

• **fractionById**: (`fractionId`: `string`) => `Promise`<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>

#### Type declaration

▸ (`fractionId`): `Promise`<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>

##### Parameters

| Name         | Type     |
| :----------- | :------- |
| `fractionId` | `string` |

##### Returns

`Promise`<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>

#### Defined in

[sdk/src/types/indexer.ts:24](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/indexer.ts#L24)

---

### fractionsByClaim

• **fractionsByClaim**: (`claimId`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<[`ClaimTokensByClaimQuery`](../modules/internal.md#claimtokensbyclaimquery)\>

#### Type declaration

▸ (`claimId`, `params?`): `Promise`<[`ClaimTokensByClaimQuery`](../modules/internal.md#claimtokensbyclaimquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `claimId` | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<[`ClaimTokensByClaimQuery`](../modules/internal.md#claimtokensbyclaimquery)\>

#### Defined in

[sdk/src/types/indexer.ts:23](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/indexer.ts#L23)

---

### fractionsByOwner

• **fractionsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>

#### Defined in

[sdk/src/types/indexer.ts:22](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/indexer.ts#L22)

---

### graphClient

• **graphClient**: `any`

#### Defined in

[sdk/src/types/indexer.ts:18](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/types/indexer.ts#L18)
