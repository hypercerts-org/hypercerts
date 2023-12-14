---
id: "HypercertClaimdata"
title: "Interface: HypercertClaimdata"
sidebar_label: "HypercertClaimdata"
sidebar_position: 0
custom_edit_url: null
---

Properties of an impact claim

## Indexable

▪ [k: `string`]: `unknown`

## Properties

### contributors

• **contributors**: `Object`

Contributors

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `display_value?` | `string` |
| `name?` | `string` |
| `value?` | `string`[] |

#### Defined in

[sdk/src/types/claimdata.d.ts:53](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/claimdata.d.ts#L53)

___

### impact\_scope

• **impact\_scope**: `Object`

Scopes of impact

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `display_value?` | `string` |
| `excludes?` | `string`[] |
| `name?` | `string` |
| `value?` | `string`[] |

#### Defined in

[sdk/src/types/claimdata.d.ts:15](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/claimdata.d.ts#L15)

___

### impact\_timeframe

• **impact\_timeframe**: `Object`

Impact time period. The value is UNIX time in seconds from epoch.

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `display_value?` | `string` |
| `name?` | `string` |
| `value?` | `number`[] |

#### Defined in

[sdk/src/types/claimdata.d.ts:44](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/claimdata.d.ts#L44)

___

### rights

• `Optional` **rights**: `Object`

Rights

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `display_value?` | `string` |
| `excludes?` | `string`[] |
| `name?` | `string` |
| `value?` | `string`[] |

#### Defined in

[sdk/src/types/claimdata.d.ts:62](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/claimdata.d.ts#L62)

___

### work\_scope

• **work\_scope**: `Object`

Scopes of work

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `display_value?` | `string` |
| `excludes?` | `string`[] |
| `name?` | `string` |
| `value?` | `string`[] |

#### Defined in

[sdk/src/types/claimdata.d.ts:25](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/claimdata.d.ts#L25)

___

### work\_timeframe

• **work\_timeframe**: `Object`

Work time period. The value is UNIX time in seconds from epoch.

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `display_value?` | `string` |
| `name?` | `string` |
| `value?` | `number`[] |

#### Defined in

[sdk/src/types/claimdata.d.ts:35](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/claimdata.d.ts#L35)
