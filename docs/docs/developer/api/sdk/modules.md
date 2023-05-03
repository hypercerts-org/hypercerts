[Hypercerts SDK Documentation](README.md) / Exports

# Hypercerts SDK Documentation

## Table of contents

### Enumerations

- [TransferRestrictions](enums/TransferRestrictions.md)

### Classes

- [HypercertClient](classes/HypercertClient.md)
- [HypercertsStorage](classes/HypercertsStorage.md)

### Interfaces

- [HypercertClaimdata](interfaces/HypercertClaimdata.md)
- [HypercertMetadata](interfaces/HypercertMetadata.md)

### Type Aliases

- [Allowlist](modules.md#allowlist)
- [AllowlistEntry](modules.md#allowlistentry)
- [ClaimByIdQuery](modules.md#claimbyidquery)
- [ClaimTokensByClaimQuery](modules.md#claimtokensbyclaimquery)

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
- [validateAllowlist](modules.md#validateallowlist)
- [validateClaimData](modules.md#validateclaimdata)
- [validateMetaData](modules.md#validatemetadata)

## Type Aliases

### Allowlist

Ƭ **Allowlist**: [`AllowlistEntry`](modules.md#allowlistentry)[]

Helper type to allow for a more readable Allowlist type

#### Defined in

[sdk/src/types/hypercerts.ts:28](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/types/hypercerts.ts#L28)

---

### AllowlistEntry

Ƭ **AllowlistEntry**: `Object`

Allowlist entry for Hypercerts matching the definitions in the Hypercerts protocol

**`Param`**

Address of the recipient

**`Param`**

Number of units allocated to the recipient

#### Type declaration

| Name      | Type           |
| :-------- | :------------- |
| `address` | `string`       |
| `units`   | `BigNumberish` |

#### Defined in

[sdk/src/types/hypercerts.ts:20](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/types/hypercerts.ts#L20)

---

### ClaimByIdQuery

Ƭ **ClaimByIdQuery**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                        |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `claim?` | `Maybe`<`Pick`<`Claim`, `"chainName"` \| `"contract"` \| `"tokenID"` \| `"creator"` \| `"id"` \| `"owner"` \| `"totalUnits"` \| `"uri"`\>\> |

#### Defined in

[sdk/.graphclient/index.ts:961](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/.graphclient/index.ts#L961)

---

### ClaimTokensByClaimQuery

Ƭ **ClaimTokensByClaimQuery**: `Object`

#### Type declaration

| Name          | Type                                                                                      |
| :------------ | :---------------------------------------------------------------------------------------- |
| `claimTokens` | `Pick`<`ClaimToken`, `"chainName"` \| `"id"` \| `"owner"` \| `"tokenID"` \| `"units"`\>[] |

#### Defined in

[sdk/.graphclient/index.ts:978](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/.graphclient/index.ts#L978)

## Variables

### HyperCertMinterFactory

• **HyperCertMinterFactory**: typeof `HypercertMinter__factory`

#### Defined in

[sdk/src/index.ts:31](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/index.ts#L31)

---

### HypercertMinterABI

• `Const` **HypercertMinterABI**: ({ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name?`: `undefined` = "balanceOf"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| { `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "AlreadyClaimed"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "error" } \| { `anonymous`: `boolean` = false; `inputs`: { `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "previousAdmin"; `type`: `string` = "address" }[] ; `name`: `string` = "AdminChanged"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| { `anonymous?`: `undefined` = false; `inputs`: { `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "balanceOf"; `outputs`: { `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[]

#### Defined in

[sdk/src/resources/HypercertMinter.ts:1](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/resources/HypercertMinter.ts#L1)

## Functions

### HypercertMinting

▸ **HypercertMinting**(`«destructured»`): `HypercertsMinterType`

**`Deprecated`**

Refactored this funtionality into the client

#### Parameters

| Name             | Type                    |
| :--------------- | :---------------------- |
| `«destructured»` | `HypercertsMinterProps` |

#### Returns

`HypercertsMinterType`

#### Defined in

[sdk/src/operator/hypercerts-minting.ts:35](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/operator/hypercerts-minting.ts#L35)

---

### claimById

▸ **claimById**(`id`): `Promise`<[`ClaimByIdQuery`](modules.md#claimbyidquery)\>

#### Parameters

| Name | Type     |
| :--- | :------- |
| `id` | `string` |

#### Returns

`Promise`<[`ClaimByIdQuery`](modules.md#claimbyidquery)\>

#### Defined in

[sdk/src/queries/claims.ts:14](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/queries/claims.ts#L14)

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

[sdk/src/queries/claims.ts:9](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/queries/claims.ts#L9)

---

### execute

▸ **execute**(`document`, `variables`, `context?`, `rootValue?`, `operationName?`): `Promise`<`ExecutionResult`<`any`, `ObjMap`<`unknown`\>\>\>

#### Parameters

| Name             | Type                              |
| :--------------- | :-------------------------------- |
| `document`       | `GraphQLOperation`<`any`, `any`\> |
| `variables`      | `any`                             |
| `context?`       | `any`                             |
| `rootValue?`     | `any`                             |
| `operationName?` | `string`                          |

#### Returns

`Promise`<`ExecutionResult`<`any`, `ObjMap`<`unknown`\>\>\>

#### Defined in

node_modules/@graphql-mesh/runtime/typings/types.d.ts:25

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

[sdk/src/queries/claims.ts:19](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/queries/claims.ts#L19)

---

### formatHypercertData

▸ **formatHypercertData**(`«destructured»`): `FormatResult`

Formats input data to an object containing HypercertMetadata including appropriate labels

#### Parameters

| Name                     | Type                                             |
| :----------------------- | :----------------------------------------------- |
| `«destructured»`         | `Object`                                         |
| › `contributors`         | `string`[]                                       |
| › `description`          | `string`                                         |
| › `excludedImpactScope`  | `string`[]                                       |
| › `excludedRights`       | `string`[]                                       |
| › `excludedWorkScope`    | `string`[]                                       |
| › `external_url?`        | `string`                                         |
| › `image`                | `string`                                         |
| › `impactScope`          | `string`[]                                       |
| › `impactTimeframeEnd`   | `number`                                         |
| › `impactTimeframeStart` | `number`                                         |
| › `name`                 | `string`                                         |
| › `properties?`          | { `trait_type`: `string` ; `value`: `string` }[] |
| › `rights`               | `string`[]                                       |
| › `version`              | `string`                                         |
| › `workScope`            | `string`[]                                       |
| › `workTimeframeEnd`     | `number`                                         |
| › `workTimeframeStart`   | `number`                                         |

#### Returns

`FormatResult`

#### Defined in

[sdk/src/utils/formatter.ts:28](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/utils/formatter.ts#L28)

---

### fractionById

▸ **fractionById**(`fractionId`): `Promise`<`ClaimTokenByIdQuery`\>

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `fractionId` | `string` |

#### Returns

`Promise`<`ClaimTokenByIdQuery`\>

#### Defined in

[sdk/src/queries/fractions.ts:19](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/queries/fractions.ts#L19)

---

### fractionsByClaim

▸ **fractionsByClaim**(`claimId`): `Promise`<[`ClaimTokensByClaimQuery`](modules.md#claimtokensbyclaimquery)\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `claimId` | `string` |

#### Returns

`Promise`<[`ClaimTokensByClaimQuery`](modules.md#claimtokensbyclaimquery)\>

#### Defined in

[sdk/src/queries/fractions.ts:14](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/queries/fractions.ts#L14)

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

[sdk/src/queries/fractions.ts:9](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/queries/fractions.ts#L9)

---

### validateAllowlist

▸ **validateAllowlist**(`data`, `units`): `Object`

#### Parameters

| Name    | Type                                |
| :------ | :---------------------------------- |
| `data`  | [`Allowlist`](modules.md#allowlist) |
| `units` | `BigNumberish`                      |

#### Returns

`Object`

| Name     | Type                                        |
| :------- | :------------------------------------------ |
| `errors` | `Record`<`string`, `string` \| `string`[]\> |
| `valid`  | `boolean`                                   |

#### Defined in

[sdk/src/validator/index.ts:62](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/validator/index.ts#L62)

---

### validateClaimData

▸ **validateClaimData**(`data`): `ValidationResult`

#### Parameters

| Name   | Type                                                     |
| :----- | :------------------------------------------------------- |
| `data` | [`HypercertClaimdata`](interfaces/HypercertClaimdata.md) |

#### Returns

`ValidationResult`

#### Defined in

[sdk/src/validator/index.ts:41](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/validator/index.ts#L41)

---

### validateMetaData

▸ **validateMetaData**(`data`): `ValidationResult`

#### Parameters

| Name   | Type                                                   |
| :----- | :----------------------------------------------------- |
| `data` | [`HypercertMetadata`](interfaces/HypercertMetadata.md) |

#### Returns

`ValidationResult`

#### Defined in

[sdk/src/validator/index.ts:20](https://github.com/Network-Goods/hypercerts/blob/759a46d/sdk/src/validator/index.ts#L20)
