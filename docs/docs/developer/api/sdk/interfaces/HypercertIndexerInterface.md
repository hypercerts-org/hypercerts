---
id: "HypercertIndexerInterface"
title: "Interface: HypercertIndexerInterface"
sidebar_label: "HypercertIndexerInterface"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### claimById

• **claimById**: (`id`: `string`) => `Promise`<`undefined` \| [`ClaimByIdQuery`](../modules.md#claimbyidquery)\>

#### Type declaration

▸ (`id`): `Promise`<`undefined` \| [`ClaimByIdQuery`](../modules.md#claimbyidquery)\>

##### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

##### Returns

`Promise`<`undefined` \| [`ClaimByIdQuery`](../modules.md#claimbyidquery)\>

#### Defined in

sdk/src/types/indexer.ts:20

---

### claimsByOwner

• **claimsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`undefined` \| [`ClaimsByOwnerQuery`](../modules.md#claimsbyownerquery)\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`<`undefined` \| [`ClaimsByOwnerQuery`](../modules.md#claimsbyownerquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`undefined` \| [`ClaimsByOwnerQuery`](../modules.md#claimsbyownerquery)\>

#### Defined in

sdk/src/types/indexer.ts:19

---

### firstClaims

• **firstClaims**: (`params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`undefined` \| [`RecentClaimsQuery`](../modules.md#recentclaimsquery)\>

#### Type declaration

▸ (`params?`): `Promise`<`undefined` \| [`RecentClaimsQuery`](../modules.md#recentclaimsquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`undefined` \| [`RecentClaimsQuery`](../modules.md#recentclaimsquery)\>

#### Defined in

sdk/src/types/indexer.ts:21

---

### fractionById

• **fractionById**: (`fractionId`: `string`) => `Promise`<`undefined` \| [`ClaimTokenByIdQuery`](../modules.md#claimtokenbyidquery)\>

#### Type declaration

▸ (`fractionId`): `Promise`<`undefined` \| [`ClaimTokenByIdQuery`](../modules.md#claimtokenbyidquery)\>

##### Parameters

| Name         | Type     |
| :----------- | :------- |
| `fractionId` | `string` |

##### Returns

`Promise`<`undefined` \| [`ClaimTokenByIdQuery`](../modules.md#claimtokenbyidquery)\>

#### Defined in

sdk/src/types/indexer.ts:24

---

### fractionsByClaim

• **fractionsByClaim**: (`claimId`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`undefined` \| [`ClaimTokensByClaimQuery`](../modules.md#claimtokensbyclaimquery)\>

#### Type declaration

▸ (`claimId`, `params?`): `Promise`<`undefined` \| [`ClaimTokensByClaimQuery`](../modules.md#claimtokensbyclaimquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `claimId` | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`undefined` \| [`ClaimTokensByClaimQuery`](../modules.md#claimtokensbyclaimquery)\>

#### Defined in

sdk/src/types/indexer.ts:23

---

### fractionsByOwner

• **fractionsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`undefined` \| [`ClaimTokensByOwnerQuery`](../modules.md#claimtokensbyownerquery)\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`<`undefined` \| [`ClaimTokensByOwnerQuery`](../modules.md#claimtokensbyownerquery)\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`undefined` \| [`ClaimTokensByOwnerQuery`](../modules.md#claimtokensbyownerquery)\>

#### Defined in

sdk/src/types/indexer.ts:22

---

### graphClient

• **graphClient**: `Client`

#### Defined in

sdk/src/types/indexer.ts:18
