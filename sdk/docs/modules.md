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
- [TransferRestrictions](modules.md#transferrestrictions)

### Functions

- [claimById](modules.md#claimbyid)
- [claimsByOwner](modules.md#claimsbyowner)
- [execute](modules.md#execute)
- [firstClaims](modules.md#firstclaims)
- [formatHypercertData](modules.md#formathypercertdata)
- [fractionById](modules.md#fractionbyid)
- [fractionsByClaim](modules.md#fractionsbyclaim)
- [fractionsByOwner](modules.md#fractionsbyowner)
- [getData](modules.md#getdata)
- [getMetadata](modules.md#getmetadata)
- [storeData](modules.md#storedata)
- [storeMetadata](modules.md#storemetadata)
- [validateClaimData](modules.md#validateclaimdata)
- [validateMetaData](modules.md#validatemetadata)

## Variables

### HyperCertMinterFactory

• **HyperCertMinterFactory**: typeof `HypercertMinter__factory`

#### Defined in

[src/index.ts:27](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/index.ts#L27)

___

### HypercertMinterABI

• **HypercertMinterABI**: ({ `anonymous`: `undefined` = false; `inputs`: `never`[] = []; `name`: `undefined` = "balanceOf"; `outputs`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| { `anonymous`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "ArraySize"; `outputs`: `undefined` ; `stateMutability`: `undefined` = "view"; `type`: `string` = "error" } \| { `anonymous`: `boolean` = false; `inputs`: { `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "previousAdmin"; `type`: `string` = "address" }[] ; `name`: `string` = "AdminChanged"; `outputs`: `undefined` ; `stateMutability`: `undefined` = "view"; `type`: `string` = "event" } \| { `anonymous`: `undefined` = false; `inputs`: { `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "balanceOf"; `outputs`: { `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[]

#### Defined in

[src/index.ts:27](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/index.ts#L27)

___

### TransferRestrictions

• `Const` **TransferRestrictions**: `Object`

COMMENTING THIS OUT FOR NOW - breaks the build
// TODO dynamic addresses and provider
const hypercertMinter = <protocol.HypercertMinter>(
 new ethers.Contract("0xcC08266250930E98256182734913Bf1B36102072", protocol.HypercertMinterABI, provider)
);

// TODO error handling
// TODO Automagic checking on mapping transferRestrictions -> value and effect
export const mintHypercertToken = async (
 claimData: HypercertMetadata,
 totalUnits: BigNumberish,
 transferRestriction: BigNumberish,
) => {
 if (validateMetaData(claimData)) {
   // store metadata on IPFS
   const cid = await storeMetadata(claimData);

   // mint hypercert token
   //return hypercertMinter.mintClaim(totalUnits, cid, transferRestriction);
 } else {
   console.log("Incorrect metadata");
 }
};

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AllowAll` | ``0`` |
| `DisallowAll` | ``2`` |
| `FromCreatorOnly` | ``1`` |

#### Defined in

[src/minting.ts:34](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/minting.ts#L34)

## Functions

### claimById

▸ **claimById**(`id`): `Promise`<`ClaimByIdQuery`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`ClaimByIdQuery`\>

#### Defined in

[src/claims.ts:7](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/claims.ts#L7)

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

[src/claims.ts:5](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/claims.ts#L5)

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

[src/claims.ts:9](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/claims.ts#L9)

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

[src/formatter.ts:17](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/formatter.ts#L17)

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

[src/fractions.ts:9](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/fractions.ts#L9)

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

[src/fractions.ts:7](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/fractions.ts#L7)

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

[src/fractions.ts:5](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/fractions.ts#L5)

___

### getData

▸ **getData**(`cidOrIpfsUri`, `targetClient?`): `Promise`<`any`\>

Get arbitrary data from web3.storage

#### Parameters

| Name | Type |
| :------ | :------ |
| `cidOrIpfsUri` | `string` |
| `targetClient?` | `any` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/operator/index.ts:70](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/index.ts#L70)

___

### getMetadata

▸ **getMetadata**(`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](interfaces/HypercertMetadata.md)\>

Retrieves NFT metadata from NFT.storage

#### Parameters

| Name | Type |
| :------ | :------ |
| `cidOrIpfsUri` | `string` |

#### Returns

`Promise`<[`HypercertMetadata`](interfaces/HypercertMetadata.md)\>

#### Defined in

[src/operator/index.ts:41](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/index.ts#L41)

___

### storeData

▸ **storeData**(`data`, `targetClient?`): `Promise`<`CIDString`\>

Store arbitrary JSON data into web3.storage
- Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob
- Because we pay for storage quotas, this data is stored best effort.
- If you are using our default keys, we may delete older data if we hit our storage quota

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `targetClient?` | `any` |

#### Returns

`Promise`<`CIDString`\>

#### Defined in

[src/operator/index.ts:56](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/index.ts#L56)

___

### storeMetadata

▸ **storeMetadata**(`data`, `targetClient?`): `Promise`<`CIDString`\>

Stores NFT metadata into NFT.storage

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`HypercertMetadata`](interfaces/HypercertMetadata.md) |
| `targetClient?` | `any` |

#### Returns

`Promise`<`CIDString`\>

#### Defined in

[src/operator/index.ts:28](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/index.ts#L28)

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

[src/validator/index.ts:41](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/validator/index.ts#L41)

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

[src/validator/index.ts:18](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/validator/index.ts#L18)
