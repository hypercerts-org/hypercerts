[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / internal

# Module: internal

## Table of contents

### Classes

- [default](../classes/internal.default.md)
- [default](../classes/internal.default-1.md)

### Interfaces

- [EvaluatorInterface](../interfaces/internal.EvaluatorInterface.md)
- [HypercertClaimdata](../interfaces/internal.HypercertClaimdata.md)

### Type Aliases

- [AcceptedToken](internal.md#acceptedtoken)
- [Allowlist](internal.md#allowlist)
- [ClaimTokenByIdQuery](internal.md#claimtokenbyidquery)
- [ClaimTokensByOwnerQuery](internal.md#claimtokensbyownerquery)
- [ClaimsByOwnerQuery](internal.md#claimsbyownerquery)
- [Exact](internal.md#exact)
- [FormatResult](internal.md#formatresult)
- [InputMaybe](internal.md#inputmaybe)
- [Maybe](internal.md#maybe)
- [Offer](internal.md#offer)
- [OfferStatus](internal.md#offerstatus)
- [OrderDirection](internal.md#orderdirection)
- [RecentClaimsQuery](internal.md#recentclaimsquery)
- [Scalars](internal.md#scalars)
- [Token](internal.md#token)
- [ValidationResult](internal.md#validationresult)

## Type Aliases

### AcceptedToken

Ƭ **AcceptedToken**: `Object`

#### Type declaration

| Name                   | Type                                            |
| :--------------------- | :---------------------------------------------- |
| `accepted`             | [`Scalars`](internal.md#scalars)[``"Boolean"``] |
| `id`                   | [`Scalars`](internal.md#scalars)[``"String"``]  |
| `minimumAmountPerUnit` | [`Scalars`](internal.md#scalars)[``"BigInt"``]  |
| `token`                | [`Token`](internal.md#token)                    |

#### Defined in

sdk/.graphclient/index.ts:349

---

### Allowlist

Ƭ **Allowlist**: `Object`

#### Type declaration

| Name    | Type                                           |
| :------ | :--------------------------------------------- |
| `claim` | [`Claim`](../modules.md#claim)                 |
| `id`    | [`Scalars`](internal.md#scalars)[``"String"``] |
| `root`  | [`Scalars`](internal.md#scalars)[``"Bytes"``]  |

#### Defined in

sdk/.graphclient/index.ts:426

---

### ClaimTokenByIdQuery

Ƭ **ClaimTokenByIdQuery**: `Object`

#### Type declaration

| Name          | Type                                                                                                                                                                                                                                                               |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claimToken?` | [`Maybe`](internal.md#maybe)\<`Pick`\<[`ClaimToken`](../modules.md#claimtoken), `"graphName"` \| `"id"` \| `"owner"` \| `"tokenID"` \| `"units"`\> & \{ `claim`: `Pick`\<[`Claim`](../modules.md#claim), `"id"` \| `"creation"` \| `"uri"` \| `"totalUnits"`\> }\> |

#### Defined in

sdk/.graphclient/index.ts:1700

---

### ClaimTokensByOwnerQuery

Ƭ **ClaimTokensByOwnerQuery**: `Object`

#### Type declaration

| Name          | Type                                                                                                                                                                                                                                 |
| :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claimTokens` | `Pick`\<[`ClaimToken`](../modules.md#claimtoken), `"graphName"` \| `"id"` \| `"owner"` \| `"tokenID"` \| `"units"`\> & \{ `claim`: `Pick`\<[`Claim`](../modules.md#claim), `"id"` \| `"creation"` \| `"uri"` \| `"totalUnits"`\> }[] |

#### Defined in

sdk/.graphclient/index.ts:1680

---

### ClaimsByOwnerQuery

Ƭ **ClaimsByOwnerQuery**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                                        |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claims` | `Pick`\<[`Claim`](../modules.md#claim), `"graphName"` \| `"contract"` \| `"tokenID"` \| `"creator"` \| `"id"` \| `"owner"` \| `"totalUnits"` \| `"uri"`\>[] |

#### Defined in

sdk/.graphclient/index.ts:1654

---

### Exact

Ƭ **Exact**\<`T`\>: \{ [K in keyof T]: T[K] }

#### Type parameters

| Name | Type             |
| :--- | :--------------- |
| `T`  | extends `Object` |

#### Defined in

sdk/.graphclient/index.ts:29

---

### FormatResult

Ƭ **FormatResult**: `Object`

#### Type declaration

| Name     | Type                                                                |
| :------- | :------------------------------------------------------------------ |
| `data`   | [`HypercertMetadata`](../interfaces/HypercertMetadata.md) \| `null` |
| `errors` | `Record`\<`string`, `string`\> \| `null`                            |
| `valid`  | `boolean`                                                           |

#### Defined in

sdk/src/utils/formatter.ts:20

---

### InputMaybe

Ƭ **InputMaybe**\<`T`\>: [`Maybe`](internal.md#maybe)\<`T`\>

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Defined in

sdk/.graphclient/index.ts:28

---

### Maybe

Ƭ **Maybe**\<`T`\>: `T` \| `null`

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Defined in

sdk/.graphclient/index.ts:27

---

### Offer

Ƭ **Offer**: `Object`

#### Type declaration

| Name               | Type                                           |
| :----------------- | :--------------------------------------------- |
| `acceptedTokens`   | [`AcceptedToken`](internal.md#acceptedtoken)[] |
| `fractionID`       | [`ClaimToken`](../modules.md#claimtoken)       |
| `id`               | [`Scalars`](internal.md#scalars)[``"String"``] |
| `maxUnitsPerTrade` | [`Scalars`](internal.md#scalars)[``"BigInt"``] |
| `minUnitsPerTrade` | [`Scalars`](internal.md#scalars)[``"BigInt"``] |
| `status`           | [`OfferStatus`](internal.md#offerstatus)       |
| `unitsAvailable`   | [`Scalars`](internal.md#scalars)[``"BigInt"``] |

#### Defined in

sdk/.graphclient/index.ts:781

---

### OfferStatus

Ƭ **OfferStatus**: `"Open"` \| `"Fulfilled"` \| `"Cancelled"`

#### Defined in

sdk/.graphclient/index.ts:800

---

### OrderDirection

Ƭ **OrderDirection**: `"asc"` \| `"desc"`

Defines the order direction, either ascending or descending

#### Defined in

sdk/.graphclient/index.ts:902

---

### RecentClaimsQuery

Ƭ **RecentClaimsQuery**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                                        |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claims` | `Pick`\<[`Claim`](../modules.md#claim), `"graphName"` \| `"contract"` \| `"tokenID"` \| `"creator"` \| `"id"` \| `"owner"` \| `"totalUnits"` \| `"uri"`\>[] |

#### Defined in

sdk/.graphclient/index.ts:1663

---

### Scalars

Ƭ **Scalars**: `Object`

All built-in and custom scalars, mapped to their actual values

#### Type declaration

| Name         | Type      |
| :----------- | :-------- |
| `BigDecimal` | `any`     |
| `BigInt`     | `any`     |
| `Boolean`    | `boolean` |
| `Bytes`      | `any`     |
| `Float`      | `number`  |
| `ID`         | `string`  |
| `Int`        | `number`  |
| `Int8`       | `any`     |
| `String`     | `string`  |

#### Defined in

sdk/.graphclient/index.ts:37

---

### Token

Ƭ **Token**: `Object`

#### Type declaration

| Name        | Type                                                                           |
| :---------- | :----------------------------------------------------------------------------- |
| `decimals?` | [`Maybe`](internal.md#maybe)\<[`Scalars`](internal.md#scalars)[``"BigInt"``]\> |
| `id`        | [`Scalars`](internal.md#scalars)[``"String"``]                                 |
| `name`      | [`Scalars`](internal.md#scalars)[``"String"``]                                 |
| `symbol?`   | [`Maybe`](internal.md#maybe)\<[`Scalars`](internal.md#scalars)[``"String"``]\> |

#### Defined in

sdk/.graphclient/index.ts:906

---

### ValidationResult

Ƭ **ValidationResult**: `Object`

Represents the result of a validation operation.

This type is used to return the result of validating data against a schema. It includes a `valid` flag that indicates
whether the data is valid, and an `errors` object that contains any errors that occurred during validation.

#### Type declaration

| Name     | Type                                                                                                                                                                                                                                            |
| :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`   | [`AllowlistEntry`](../modules.md#allowlistentry)[] \| [`EvaluationData`](../modules.md#evaluationdata) \| [`HypercertClaimdata`](../interfaces/HypercertClaimdata.md) \| [`HypercertMetadata`](../interfaces/HypercertMetadata.md) \| `unknown` |
| `errors` | `Record`\<`string`, `string` \| `string`[]\>                                                                                                                                                                                                    |
| `valid`  | `boolean`                                                                                                                                                                                                                                       |

#### Defined in

sdk/src/validator/index.ts:30
