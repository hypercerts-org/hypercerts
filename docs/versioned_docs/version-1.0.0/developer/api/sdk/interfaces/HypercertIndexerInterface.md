---
id: "HypercertIndexerInterface"
title: "Interface: HypercertIndexerInterface"
sidebar_label: "HypercertIndexerInterface"
sidebar_position: 0
custom_edit_url: null
---

## Properties

### claimById

• **claimById**: (`id`: `string`) => `Promise`<`undefined` \| `ClaimByIdQuery`\>

#### Type declaration

▸ (`id`): `Promise`<`undefined` \| `ClaimByIdQuery`\>

##### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

##### Returns

`Promise`<`undefined` \| `ClaimByIdQuery`\>

#### Defined in

sdk/src/types/indexer.ts:20

---

### claimsByOwner

• **claimsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`undefined` \| `ClaimsByOwnerQuery`\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`<`undefined` \| `ClaimsByOwnerQuery`\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`undefined` \| `ClaimsByOwnerQuery`\>

#### Defined in

sdk/src/types/indexer.ts:19

---

### firstClaims

• **firstClaims**: (`params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`undefined` \| `RecentClaimsQuery`\>

#### Type declaration

▸ (`params?`): `Promise`<`undefined` \| `RecentClaimsQuery`\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`undefined` \| `RecentClaimsQuery`\>

#### Defined in

sdk/src/types/indexer.ts:21

---

### fractionById

• **fractionById**: (`fractionId`: `string`) => `Promise`<`undefined` \| `ClaimTokenByIdQuery`\>

#### Type declaration

▸ (`fractionId`): `Promise`<`undefined` \| `ClaimTokenByIdQuery`\>

##### Parameters

| Name         | Type     |
| :----------- | :------- |
| `fractionId` | `string` |

##### Returns

`Promise`<`undefined` \| `ClaimTokenByIdQuery`\>

#### Defined in

sdk/src/types/indexer.ts:24

---

### fractionsByClaim

• **fractionsByClaim**: (`claimId`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`undefined` \| `ClaimTokensByClaimQuery`\>

#### Type declaration

▸ (`claimId`, `params?`): `Promise`<`undefined` \| `ClaimTokensByClaimQuery`\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `claimId` | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`undefined` \| `ClaimTokensByClaimQuery`\>

#### Defined in

sdk/src/types/indexer.ts:23

---

### fractionsByOwner

• **fractionsByOwner**: (`owner`: `string`, `params?`: [`QueryParams`](../modules.md#queryparams)) => `Promise`<`undefined` \| `ClaimTokensByOwnerQuery`\>

#### Type declaration

▸ (`owner`, `params?`): `Promise`<`undefined` \| `ClaimTokensByOwnerQuery`\>

##### Parameters

| Name      | Type                                       |
| :-------- | :----------------------------------------- |
| `owner`   | `string`                                   |
| `params?` | [`QueryParams`](../modules.md#queryparams) |

##### Returns

`Promise`<`undefined` \| `ClaimTokensByOwnerQuery`\>

#### Defined in

sdk/src/types/indexer.ts:22

---

### graphClient

• **graphClient**: `Client`

#### Defined in

sdk/src/types/indexer.ts:18
