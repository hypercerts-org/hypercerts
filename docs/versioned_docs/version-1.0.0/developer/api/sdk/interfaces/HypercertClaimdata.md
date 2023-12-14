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

| Name             | Type       |
| :--------------- | :--------- |
| `display_value?` | `string`   |
| `name?`          | `string`   |
| `value?`         | `string`[] |

#### Defined in

sdk/src/types/claimdata.d.ts:53

---

### impact_scope

• **impact_scope**: `Object`

Scopes of impact

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name             | Type       |
| :--------------- | :--------- |
| `display_value?` | `string`   |
| `excludes?`      | `string`[] |
| `name?`          | `string`   |
| `value?`         | `string`[] |

#### Defined in

sdk/src/types/claimdata.d.ts:15

---

### impact_timeframe

• **impact_timeframe**: `Object`

Impact time period. The value is UNIX time in seconds from epoch.

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name             | Type       |
| :--------------- | :--------- |
| `display_value?` | `string`   |
| `name?`          | `string`   |
| `value?`         | `number`[] |

#### Defined in

sdk/src/types/claimdata.d.ts:44

---

### rights

• `Optional` **rights**: `Object`

Rights

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name             | Type       |
| :--------------- | :--------- |
| `display_value?` | `string`   |
| `excludes?`      | `string`[] |
| `name?`          | `string`   |
| `value?`         | `string`[] |

#### Defined in

sdk/src/types/claimdata.d.ts:62

---

### work_scope

• **work_scope**: `Object`

Scopes of work

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name             | Type       |
| :--------------- | :--------- |
| `display_value?` | `string`   |
| `excludes?`      | `string`[] |
| `name?`          | `string`   |
| `value?`         | `string`[] |

#### Defined in

sdk/src/types/claimdata.d.ts:25

---

### work_timeframe

• **work_timeframe**: `Object`

Work time period. The value is UNIX time in seconds from epoch.

#### Index signature

▪ [k: `string`]: `unknown`

#### Type declaration

| Name             | Type       |
| :--------------- | :--------- |
| `display_value?` | `string`   |
| `name?`          | `string`   |
| `value?`         | `number`[] |

#### Defined in

sdk/src/types/claimdata.d.ts:35
