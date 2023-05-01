[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) /
[types/claimdata](../modules/types_claimdata.md) / HypercertClaimdata

# Interface: HypercertClaimdata

[types/claimdata](../modules/types_claimdata.md).HypercertClaimdata

Properties of an impact claim

## Indexable

▪ [k: `string`]: `unknown`

## Table of contents

### Properties

- [contributors](types_claimdata.HypercertClaimdata.md#contributors)
- [impact_scope](types_claimdata.HypercertClaimdata.md#impact_scope)
- [impact_timeframe](types_claimdata.HypercertClaimdata.md#impact_timeframe)
- [rights](types_claimdata.HypercertClaimdata.md#rights)
- [work_scope](types_claimdata.HypercertClaimdata.md#work_scope)
- [work_timeframe](types_claimdata.HypercertClaimdata.md#work_timeframe)

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

[sdk/src/types/claimdata.d.ts:53](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/claimdata.d.ts#L53)

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

[sdk/src/types/claimdata.d.ts:15](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/claimdata.d.ts#L15)

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

[sdk/src/types/claimdata.d.ts:44](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/claimdata.d.ts#L44)

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

[sdk/src/types/claimdata.d.ts:62](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/claimdata.d.ts#L62)

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

[sdk/src/types/claimdata.d.ts:25](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/claimdata.d.ts#L25)

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

[sdk/src/types/claimdata.d.ts:35](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/claimdata.d.ts#L35)
