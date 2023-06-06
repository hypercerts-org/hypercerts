[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [internal](../modules/internal.md) / default

# Class: default

[internal](../modules/internal.md).default

A class that provides indexing functionality for Hypercerts.

## Implements

- [`HypercertIndexerInterface`](../interfaces/HypercertIndexerInterface.md)

## Table of contents

### Constructors

- [constructor](internal.default-2.md#constructor)

### Properties

- [\_graphClient](internal.default-2.md#_graphclient)

### Accessors

- [graphClient](internal.default-2.md#graphclient)

### Methods

- [claimById](internal.default-2.md#claimbyid)
- [claimsByOwner](internal.default-2.md#claimsbyowner)
- [firstClaims](internal.default-2.md#firstclaims)
- [fractionById](internal.default-2.md#fractionbyid)
- [fractionsByClaim](internal.default-2.md#fractionsbyclaim)
- [fractionsByOwner](internal.default-2.md#fractionsbyowner)

## Constructors

### constructor

• **new default**(`options`)

Creates a new instance of the `HypercertIndexer` class.

#### Parameters

| Name                 | Type     | Description                                |
| :------------------- | :------- | :----------------------------------------- |
| `options`            | `Object` | The configuration options for the indexer. |
| `options.graphName?` | `string` | -                                          |

#### Defined in

[sdk/src/indexer.ts:17](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L17)

## Properties

### \_graphClient

• `Private` **\_graphClient**: `Object`

The Graph client used by the indexer.

#### Type declaration

| Name                 | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ClaimById`          | (`variables`: [`Exact`](../modules/internal.md#exact)<{ `id`: `string` }\>, `options?`: `unknown`) => `Promise`<[`ClaimByIdQuery`](../modules/internal.md#claimbyidquery)\>                                                                                                                                                                                                                                                                                                            |
| `ClaimTokenById`     | (`variables`: [`Exact`](../modules/internal.md#exact)<{ `claimTokenId`: `string` }\>, `options?`: `unknown`) => `Promise`<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>                                                                                                                                                                                                                                                                                        |
| `ClaimTokensByClaim` | (`variables`: [`Exact`](../modules/internal.md#exact)<{ `claimId`: `string` ; `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> }\>, `options?`: `unknown`) => `Promise`<[`ClaimTokensByClaimQuery`](../modules/internal.md#claimtokensbyclaimquery)\> |
| `ClaimTokensByOwner` | (`variables?`: [`Exact`](../modules/internal.md#exact)<{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `owner?`: `any` ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> }\>, `options?`: `unknown`) => `Promise`<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>    |
| `ClaimsByOwner`      | (`variables?`: [`Exact`](../modules/internal.md#exact)<{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `owner?`: `any` ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> }\>, `options?`: `unknown`) => `Promise`<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>              |
| `RecentClaims`       | (`variables?`: [`Exact`](../modules/internal.md#exact)<{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> }\>, `options?`: `unknown`) => `Promise`<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>                                  |

#### Defined in

[sdk/src/indexer.ts:11](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L11)

## Accessors

### graphClient

• `get` **graphClient**(): `Object`

Gets the Graph client used by the indexer.

#### Returns

`Object`

The Graph client.

| Name                 | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ClaimById`          | (`variables`: [`Exact`](../modules/internal.md#exact)<{ `id`: `string` }\>, `options?`: `unknown`) => `Promise`<[`ClaimByIdQuery`](../modules/internal.md#claimbyidquery)\>                                                                                                                                                                                                                                                                                                            |
| `ClaimTokenById`     | (`variables`: [`Exact`](../modules/internal.md#exact)<{ `claimTokenId`: `string` }\>, `options?`: `unknown`) => `Promise`<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>                                                                                                                                                                                                                                                                                        |
| `ClaimTokensByClaim` | (`variables`: [`Exact`](../modules/internal.md#exact)<{ `claimId`: `string` ; `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> }\>, `options?`: `unknown`) => `Promise`<[`ClaimTokensByClaimQuery`](../modules/internal.md#claimtokensbyclaimquery)\> |
| `ClaimTokensByOwner` | (`variables?`: [`Exact`](../modules/internal.md#exact)<{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `owner?`: `any` ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> }\>, `options?`: `unknown`) => `Promise`<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>    |
| `ClaimsByOwner`      | (`variables?`: [`Exact`](../modules/internal.md#exact)<{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `owner?`: `any` ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> }\>, `options?`: `unknown`) => `Promise`<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>              |
| `RecentClaims`       | (`variables?`: [`Exact`](../modules/internal.md#exact)<{ `first?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> ; `orderDirection?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<[`OrderDirection`](../modules/internal.md#orderdirection)\> ; `skip?`: [`InputMaybe`](../modules/internal.md#inputmaybe)<`number`\> }\>, `options?`: `unknown`) => `Promise`<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>                                  |

#### Implementation of

[HypercertIndexerInterface](../interfaces/HypercertIndexerInterface.md).[graphClient](../interfaces/HypercertIndexerInterface.md#graphclient)

#### Defined in

[sdk/src/indexer.ts:25](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L25)

## Methods

### claimById

▸ **claimById**(`id`): `Promise`<[`ClaimByIdQuery`](../modules/internal.md#claimbyidquery)\>

Gets a claim by its ID.

#### Parameters

| Name | Type     | Description          |
| :--- | :------- | :------------------- |
| `id` | `string` | The ID of the claim. |

#### Returns

`Promise`<[`ClaimByIdQuery`](../modules/internal.md#claimbyidquery)\>

A Promise that resolves to the claim.

#### Implementation of

HypercertIndexerInterface.claimById

#### Defined in

[sdk/src/indexer.ts:46](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L46)

---

### claimsByOwner

▸ **claimsByOwner**(`owner`, `params?`): `Promise`<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>

Gets the claims owned by a given address.

#### Parameters

| Name     | Type                                       | Default value        | Description               |
| :------- | :----------------------------------------- | :------------------- | :------------------------ |
| `owner`  | `string`                                   | `undefined`          | The address of the owner. |
| `params` | [`QueryParams`](../modules.md#queryparams) | `defaultQueryParams` | The query parameters.     |

#### Returns

`Promise`<[`ClaimsByOwnerQuery`](../modules/internal.md#claimsbyownerquery)\>

A Promise that resolves to the claims.

#### Implementation of

HypercertIndexerInterface.claimsByOwner

#### Defined in

[sdk/src/indexer.ts:35](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L35)

---

### firstClaims

▸ **firstClaims**(`params?`): `Promise`<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>

Gets the most recent claims.

#### Parameters

| Name     | Type                                       | Default value        | Description           |
| :------- | :----------------------------------------- | :------------------- | :-------------------- |
| `params` | [`QueryParams`](../modules.md#queryparams) | `defaultQueryParams` | The query parameters. |

#### Returns

`Promise`<[`RecentClaimsQuery`](../modules/internal.md#recentclaimsquery)\>

A Promise that resolves to the claims.

#### Implementation of

HypercertIndexerInterface.firstClaims

#### Defined in

[sdk/src/indexer.ts:56](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L56)

---

### fractionById

▸ **fractionById**(`fractionId`): `Promise`<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>

Gets a claim token by its ID.

#### Parameters

| Name         | Type     | Description                |
| :----------- | :------- | :------------------------- |
| `fractionId` | `string` | The ID of the claim token. |

#### Returns

`Promise`<[`ClaimTokenByIdQuery`](../modules/internal.md#claimtokenbyidquery)\>

A Promise that resolves to the claim token.

#### Implementation of

HypercertIndexerInterface.fractionById

#### Defined in

[sdk/src/indexer.ts:90](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L90)

---

### fractionsByClaim

▸ **fractionsByClaim**(`claimId`, `params?`): `Promise`<[`ClaimTokensByClaimQuery`](../modules/internal.md#claimtokensbyclaimquery)\>

Gets the claim tokens for a given claim.

#### Parameters

| Name      | Type                                       | Default value        | Description           |
| :-------- | :----------------------------------------- | :------------------- | :-------------------- |
| `claimId` | `string`                                   | `undefined`          | The ID of the claim.  |
| `params`  | [`QueryParams`](../modules.md#queryparams) | `defaultQueryParams` | The query parameters. |

#### Returns

`Promise`<[`ClaimTokensByClaimQuery`](../modules/internal.md#claimtokensbyclaimquery)\>

A Promise that resolves to the claim tokens.

#### Implementation of

HypercertIndexerInterface.fractionsByClaim

#### Defined in

[sdk/src/indexer.ts:79](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L79)

---

### fractionsByOwner

▸ **fractionsByOwner**(`owner`, `params?`): `Promise`<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>

Gets the claim tokens owned by a given address.

#### Parameters

| Name     | Type                                       | Default value        | Description               |
| :------- | :----------------------------------------- | :------------------- | :------------------------ |
| `owner`  | `string`                                   | `undefined`          | The address of the owner. |
| `params` | [`QueryParams`](../modules.md#queryparams) | `defaultQueryParams` | The query parameters.     |

#### Returns

`Promise`<[`ClaimTokensByOwnerQuery`](../modules/internal.md#claimtokensbyownerquery)\>

A Promise that resolves to the claim tokens.

#### Implementation of

HypercertIndexerInterface.fractionsByOwner

#### Defined in

[sdk/src/indexer.ts:67](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/indexer.ts#L67)
