[@hypercerts-org/hypercerts-sdk](README.md) / Exports

# @hypercerts-org/hypercerts-sdk

## Table of contents

### Classes

- [HypercertsStorage](classes/HypercertsStorage.md)

### Interfaces

- [HypercertClaimdata](interfaces/HypercertClaimdata.md)
- [HypercertMetadata](interfaces/HypercertMetadata.md)

### Variables

- [HyperCertMinterFactory](modules.md#hypercertminterfactory)
- [HypercertMinterABI](modules.md#hypercertminterabi)

### Functions

- [HypercertMinting](modules.md#hypercertminting)
- [claimById](modules.md#claimbyid)
- [claimsByOwner](modules.md#claimsbyowner)
- [execute](modules.md#execute)
- [firstClaims](modules.md#firstclaims)
- [formatHypercertData](modules.md#formathypercertdata)
- [fractionById](modules.md#fractionbyid)
- [fractionsByClaim](modules.md#fractionsbyclaim)
- [fractionsByOwner](modules.md#fractionsbyowner)
- [validateClaimData](modules.md#validateclaimdata)
- [validateMetaData](modules.md#validatemetadata)

## Variables

### HyperCertMinterFactory

• **HyperCertMinterFactory**: typeof `HypercertMinter__factory`

#### Defined in

[src/index.ts:22](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/index.ts#L22)

___

### HypercertMinterABI

• `Const` **HypercertMinterABI**: ({ `anonymous`: `undefined` = false; `inputs`: `never`[] = []; `name`: `undefined` = "balanceOf"; `outputs`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| { `anonymous`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "AlreadyClaimed"; `outputs`: `undefined` ; `stateMutability`: `undefined` = "view"; `type`: `string` = "error" } \| { `anonymous`: `boolean` = false; `inputs`: { `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "previousAdmin"; `type`: `string` = "address" }[] ; `name`: `string` = "AdminChanged"; `outputs`: `undefined` ; `stateMutability`: `undefined` = "view"; `type`: `string` = "event" } \| { `anonymous`: `undefined` = false; `inputs`: { `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "balanceOf"; `outputs`: { `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[]

#### Defined in

[src/resources/HypercertMinter.ts:1](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/resources/HypercertMinter.ts#L1)

## Functions

### HypercertMinting

▸ **HypercertMinting**(`«destructured»`): `HypercertsMinterType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `HypercertsMinterProps` |

#### Returns

`HypercertsMinterType`

#### Defined in

[src/operator/hypercerts-minting.ts:22](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-minting.ts#L22)

___

### claimById

▸ **claimById**(`id`): `Promise`<`ClaimByIdQuery`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`ClaimByIdQuery`\>

#### Defined in

[src/queries/claims.ts:15](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/queries/claims.ts#L15)

___

### claimsByOwner

▸ **claimsByOwner**(`owner`): `Promise`<`ClaimsByOwnerQuery`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `owner` | `string` |

#### Returns

`Promise`<`ClaimsByOwnerQuery`\>

#### Defined in

[src/queries/claims.ts:10](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/queries/claims.ts#L10)

___

### execute

▸ **execute**(`document`, `variables`, `context?`, `rootValue?`, `operationName?`): `Promise`<`ExecutionResult`<`any`, `ObjMap`<`unknown`\>\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `document` | `GraphQLOperation`<`any`, `any`\> |
| `variables` | `any` |
| `context?` | `any` |
| `rootValue?` | `any` |
| `operationName?` | `string` |

#### Returns

`Promise`<`ExecutionResult`<`any`, `ObjMap`<`unknown`\>\>\>

#### Defined in

node_modules/@graphql-mesh/runtime/typings/types.d.ts:25

___

### firstClaims

▸ **firstClaims**(`first`): `Promise`<`RecentClaimsQuery`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `first` | `number` |

#### Returns

`Promise`<`RecentClaimsQuery`\>

#### Defined in

[src/queries/claims.ts:20](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/queries/claims.ts#L20)

___

### formatHypercertData

▸ **formatHypercertData**(`«destructured»`): `Object`

Formats input data to an object containing HypercertMetadata including appropriate labels

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `contributors` | `string`[] |
| › `description` | `string` |
| › `excludedImpactScope` | `string`[] |
| › `excludedRights` | `string`[] |
| › `excludedWorkScope` | `string`[] |
| › `external_url` | `string` |
| › `image` | `string` |
| › `impactScope` | `string`[] |
| › `impactTimeframeEnd` | `number` |
| › `impactTimeframeStart` | `number` |
| › `name` | `string` |
| › `properties` | { `trait_type`: `string` ; `value`: `string`  }[] |
| › `rights` | `string`[] |
| › `version` | `string` |
| › `workScope` | `string`[] |
| › `workTimeframeEnd` | `number` |
| › `workTimeframeStart` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `data` | ``null`` \| [`HypercertMetadata`](interfaces/HypercertMetadata.md) |
| `errors` | `Record`<`string`, `string`\> |
| `valid` | `boolean` |

#### Defined in

[src/utils/formatter.ts:27](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/utils/formatter.ts#L27)

___

### fractionById

▸ **fractionById**(`fractionId`): `Promise`<`ClaimTokenByIdQuery`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fractionId` | `string` |

#### Returns

`Promise`<`ClaimTokenByIdQuery`\>

#### Defined in

[src/queries/fractions.ts:18](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/queries/fractions.ts#L18)

___

### fractionsByClaim

▸ **fractionsByClaim**(`claimId`): `Promise`<`ClaimTokensByClaimQuery`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `claimId` | `string` |

#### Returns

`Promise`<`ClaimTokensByClaimQuery`\>

#### Defined in

[src/queries/fractions.ts:13](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/queries/fractions.ts#L13)

___

### fractionsByOwner

▸ **fractionsByOwner**(`owner`): `Promise`<`ClaimTokensByOwnerQuery`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `owner` | `string` |

#### Returns

`Promise`<`ClaimTokensByOwnerQuery`\>

#### Defined in

[src/queries/fractions.ts:8](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/queries/fractions.ts#L8)

___

### validateClaimData

▸ **validateClaimData**(`data`): `Result`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`HypercertClaimdata`](interfaces/HypercertClaimdata.md) |

#### Returns

`Result`

#### Defined in

[src/validator/index.ts:41](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/validator/index.ts#L41)

___

### validateMetaData

▸ **validateMetaData**(`data`): `Result`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`HypercertMetadata`](interfaces/HypercertMetadata.md) |

#### Returns

`Result`

#### Defined in

[src/validator/index.ts:18](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/validator/index.ts#L18)
