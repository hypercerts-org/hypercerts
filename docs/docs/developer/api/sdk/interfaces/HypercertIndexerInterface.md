[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertIndexerInterface

# Interface: HypercertIndexerInterface

## Implemented by

- [`default`](../classes/internal.default-1.md)

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

• **claimById**: (`id`: `string`) => `Promise`\<[`ClaimByIdQuery`](../modules.md#claimbyidquery)\>

#### Type declaration

▸ (`id`): `Promise`\<[`ClaimByIdQuery`](../modules.md#claimbyidquery)\>

##### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

##### Returns

`Promise`\<[`ClaimByIdQuery`](../modules.md#claimbyidquery)\>

#### Defined in

sdk/src/types/indexer.ts:21

---

### claimsByOwner

• **claimsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`\<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`\<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`\<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>

#### Defined in

sdk/src/types/indexer.ts:20

---

### firstClaims

• **firstClaims**: (`params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`\<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>

#### Type declaration

▸ (`params?`): `Promise`\<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`\<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>

#### Defined in

sdk/src/types/indexer.ts:22

---

### fractionById

• **fractionById**: (`fractionId`: `string`) => `Promise`\<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>

#### Type declaration

▸ (`fractionId`): `Promise`\<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>

##### Parameters

| Name         | Type     |
| :----------- | :------- |
| `fractionId` | `string` |

##### Returns

`Promise`\<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>

#### Defined in

sdk/src/types/indexer.ts:25

---

### fractionsByClaim

• **fractionsByClaim**: (`claimId`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`\<[`ClaimTokensByClaimQuery`](../modules.md#claimtokensbyclaimquery)\>

#### Type declaration

▸ (`claimId`, `params?`): `Promise`\<[`ClaimTokensByClaimQuery`](../modules.md#claimtokensbyclaimquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `claimId` | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`\<[`ClaimTokensByClaimQuery`](../modules.md#claimtokensbyclaimquery)\>

#### Defined in

sdk/src/types/indexer.ts:24

---

### fractionsByOwner

• **fractionsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`\<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`\<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`\<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>

#### Defined in

sdk/src/types/indexer.ts:23

---

### graphClient

• **graphClient**: `Object`

#### Type declaration

| Name                 | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ClaimById`          | (`variables`: [`Exact`](../modules/internal.md#exact)\<\{ `id`: `string` }\>, `options?`: `unknown`) => `Promise`\<[`ClaimByIdQuery`](../modules.md#claimbyidquery)\>                                                                                                                                                                                                                                                                                                                     |
| `ClaimTokenById`     | (`variables`: [`Exact`](../modules/internal.md#exact)\<\{ `claimTokenId`: `string` }\>, `options?`: `unknown`) => `Promise`\<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>                                                                                                                                                                                                                                                                                        |
| `ClaimTokensByClaim` | (`variables`: [`Exact`](../modules/internal.md#exact)\<\{ `claimId`: `string` ; `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<`number`\> }\>, `options?`: `unknown`) => `Promise`\<[`ClaimTokensByClaimQuery`](../modules.md#claimtokensbyclaimquery)\>       |
| `ClaimTokensByOwner` | (`variables?`: [`Exact`](../modules/internal.md#exact)\<\{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `owner?`: `any` ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<`number`\> }\>, `options?`: `unknown`) => `Promise`\<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\> |
| `ClaimsByOwner`      | (`variables?`: [`Exact`](../modules/internal.md#exact)\<\{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `owner?`: `any` ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<`number`\> }\>, `options?`: `unknown`) => `Promise`\<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>           |
| `RecentClaims`       | (`variables?`: [`Exact`](../modules/internal.md#exact)\<\{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)\<`number`\> }\>, `options?`: `unknown`) => `Promise`\<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>                               |

#### Defined in

sdk/src/types/indexer.ts:19
