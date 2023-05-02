[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / global

# Module: global

## Table of contents

### Type Aliases

- [ClaimByIdQuery](global.md#claimbyidquery)
- [ClaimTokensByClaimQuery](global.md#claimtokensbyclaimquery)

## Type Aliases

### ClaimByIdQuery

Ƭ **ClaimByIdQuery**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                        |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `claim?` | `Maybe`<`Pick`<`Claim`, `"chainName"` \| `"contract"` \| `"tokenID"` \| `"creator"` \| `"id"` \| `"owner"` \| `"totalUnits"` \| `"uri"`\>\> |

#### Defined in

[sdk/.graphclient/index.ts:961](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/.graphclient/index.ts#L961)

---

### ClaimTokensByClaimQuery

Ƭ **ClaimTokensByClaimQuery**: `Object`

#### Type declaration

| Name          | Type                                                                                      |
| :------------ | :---------------------------------------------------------------------------------------- |
| `claimTokens` | `Pick`<`ClaimToken`, `"chainName"` \| `"id"` \| `"owner"` \| `"tokenID"` \| `"units"`\>[] |

#### Defined in

[sdk/.graphclient/index.ts:978](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/.graphclient/index.ts#L978)
