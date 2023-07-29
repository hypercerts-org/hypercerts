[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / internal

# Module: internal

## Table of contents

### Classes

- [default](../classes/internal.default.md)
- [default](../classes/internal.default-1.md)
- [default](../classes/internal.default-2.md)

### Interfaces

- [EvaluatorInterface](../interfaces/internal.EvaluatorInterface.md)
- [HypercertClaimdata](../interfaces/internal.HypercertClaimdata.md)
- [HypercertMinter](../interfaces/internal.HypercertMinter.md)

### Type Aliases

- [Claim](internal.md#claim)
- [ClaimByIdQuery](internal.md#claimbyidquery)
- [ClaimToken](internal.md#claimtoken)
- [ClaimTokenByIdQuery](internal.md#claimtokenbyidquery)
- [ClaimTokensByClaimQuery](internal.md#claimtokensbyclaimquery)
- [ClaimTokensByOwnerQuery](internal.md#claimtokensbyownerquery)
- [ClaimsByOwnerQuery](internal.md#claimsbyownerquery)
- [Exact](internal.md#exact)
- [FormatResult](internal.md#formatresult)
- [InputMaybe](internal.md#inputmaybe)
- [Maybe](internal.md#maybe)
- [OrderDirection](internal.md#orderdirection)
- [RecentClaimsQuery](internal.md#recentclaimsquery)
- [Scalars](internal.md#scalars)
- [ValidationResult](internal.md#validationresult)

## Type Aliases

### Claim

Ƭ **Claim**: `Object`

#### Type declaration

| Name          | Type                                                                          |
| :------------ | :---------------------------------------------------------------------------- |
| `chainName`   | [`Scalars`](internal.md#scalars)[``"String"``]                                |
| `contract`    | [`Scalars`](internal.md#scalars)[``"String"``]                                |
| `creation`    | [`Scalars`](internal.md#scalars)[``"BigInt"``]                                |
| `creator?`    | [`Maybe`](internal.md#maybe)<[`Scalars`](internal.md#scalars)[``"Bytes"``]\>  |
| `id`          | [`Scalars`](internal.md#scalars)[``"String"``]                                |
| `owner?`      | [`Maybe`](internal.md#maybe)<[`Scalars`](internal.md#scalars)[``"Bytes"``]\>  |
| `tokenID`     | [`Scalars`](internal.md#scalars)[``"BigInt"``]                                |
| `totalUnits?` | [`Maybe`](internal.md#maybe)<[`Scalars`](internal.md#scalars)[``"BigInt"``]\> |
| `uri?`        | [`Maybe`](internal.md#maybe)<[`Scalars`](internal.md#scalars)[``"String"``]\> |

#### Defined in

[sdk/.graphclient/index.ts:275](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L275)

---

### ClaimByIdQuery

Ƭ **ClaimByIdQuery**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                                                                  |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `claim?` | [`Maybe`](internal.md#maybe)<`Pick`<[`Claim`](internal.md#claim), `"chainName"` \| `"contract"` \| `"tokenID"` \| `"creator"` \| `"id"` \| `"owner"` \| `"totalUnits"` \| `"uri"`\>\> |

#### Defined in

[sdk/.graphclient/index.ts:985](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L985)

---

### ClaimToken

Ƭ **ClaimToken**: `Object`

#### Type declaration

| Name        | Type                                           |
| :---------- | :--------------------------------------------- |
| `chainName` | [`Scalars`](internal.md#scalars)[``"String"``] |
| `claim`     | [`Claim`](internal.md#claim)                   |
| `id`        | [`Scalars`](internal.md#scalars)[``"String"``] |
| `owner`     | [`Scalars`](internal.md#scalars)[``"Bytes"``]  |
| `tokenID`   | [`Scalars`](internal.md#scalars)[``"BigInt"``] |
| `units`     | [`Scalars`](internal.md#scalars)[``"BigInt"``] |

#### Defined in

[sdk/.graphclient/index.ts:287](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L287)

---

### ClaimTokenByIdQuery

Ƭ **ClaimTokenByIdQuery**: `Object`

#### Type declaration

| Name          | Type                                                                                                                                                                                                                                                       |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claimToken?` | [`Maybe`](internal.md#maybe)<`Pick`<[`ClaimToken`](internal.md#claimtoken), `"chainName"` \| `"id"` \| `"owner"` \| `"tokenID"` \| `"units"`\> & { `claim`: `Pick`<[`Claim`](internal.md#claim), `"id"` \| `"creation"` \| `"uri"` \| `"totalUnits"`\> }\> |

#### Defined in

[sdk/.graphclient/index.ts:1015](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L1015)

---

### ClaimTokensByClaimQuery

Ƭ **ClaimTokensByClaimQuery**: `Object`

#### Type declaration

| Name          | Type                                                                                                                |
| :------------ | :------------------------------------------------------------------------------------------------------------------ |
| `claimTokens` | `Pick`<[`ClaimToken`](internal.md#claimtoken), `"chainName"` \| `"id"` \| `"owner"` \| `"tokenID"` \| `"units"`\>[] |

#### Defined in

[sdk/.graphclient/index.ts:1008](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L1008)

---

### ClaimTokensByOwnerQuery

Ƭ **ClaimTokensByOwnerQuery**: `Object`

#### Type declaration

| Name          | Type                                                                                                                                                                                                                          |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claimTokens` | `Pick`<[`ClaimToken`](internal.md#claimtoken), `"chainName"` \| `"id"` \| `"owner"` \| `"tokenID"` \| `"units"`\> & { `claim`: `Pick`<[`Claim`](internal.md#claim), `"id"` \| `"creation"` \| `"uri"` \| `"totalUnits"`\> }[] |

#### Defined in

[sdk/.graphclient/index.ts:995](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L995)

---

### ClaimsByOwnerQuery

Ƭ **ClaimsByOwnerQuery**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                                     |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claims` | `Pick`<[`Claim`](internal.md#claim), `"chainName"` \| `"contract"` \| `"tokenID"` \| `"creator"` \| `"id"` \| `"owner"` \| `"totalUnits"` \| `"uri"`\>[] |

#### Defined in

[sdk/.graphclient/index.ts:969](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L969)

---

### Exact

Ƭ **Exact**<`T`\>: { [K in keyof T]: T[K] }

#### Type parameters

| Name | Type             |
| :--- | :--------------- |
| `T`  | extends `Object` |

#### Defined in

[sdk/.graphclient/index.ts:28](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L28)

---

### FormatResult

Ƭ **FormatResult**: `Object`

#### Type declaration

| Name     | Type                                                                |
| :------- | :------------------------------------------------------------------ |
| `data`   | [`HypercertMetadata`](../interfaces/HypercertMetadata.md) \| `null` |
| `errors` | `Record`<`string`, `string`\> \| `null`                             |
| `valid`  | `boolean`                                                           |

#### Defined in

[sdk/src/utils/formatter.ts:20](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/utils/formatter.ts#L20)

---

### InputMaybe

Ƭ **InputMaybe**<`T`\>: [`Maybe`](internal.md#maybe)<`T`\>

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Defined in

[sdk/.graphclient/index.ts:27](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L27)

---

### Maybe

Ƭ **Maybe**<`T`\>: `T` \| `null`

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Defined in

[sdk/.graphclient/index.ts:26](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L26)

---

### OrderDirection

Ƭ **OrderDirection**: `"asc"` \| `"desc"`

Defines the order direction, either ascending or descending

#### Defined in

[sdk/.graphclient/index.ts:507](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L507)

---

### RecentClaimsQuery

Ƭ **RecentClaimsQuery**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                                     |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claims` | `Pick`<[`Claim`](internal.md#claim), `"chainName"` \| `"contract"` \| `"tokenID"` \| `"creator"` \| `"id"` \| `"owner"` \| `"totalUnits"` \| `"uri"`\>[] |

#### Defined in

[sdk/.graphclient/index.ts:978](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L978)

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

[sdk/.graphclient/index.ts:36](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/.graphclient/index.ts#L36)

---

### ValidationResult

Ƭ **ValidationResult**: `Object`

The result of a validation.

**`Property`**

Whether the data is valid.

**`Property`**

A map of errors, where the key is the field that failed validation and the value is the error message.

#### Type declaration

| Name     | Type                          |
| :------- | :---------------------------- |
| `errors` | `Record`<`string`, `string`\> |
| `valid`  | `boolean`                     |

#### Defined in

[sdk/src/validator/index.ts:28](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/validator/index.ts#L28)
