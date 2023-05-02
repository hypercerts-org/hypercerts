[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/metadata](../modules/types_metadata.md) / HypercertClaimdata

# Interface: HypercertClaimdata

[types/metadata](../modules/types_metadata.md).HypercertClaimdata

Properties of an impact claim

## Indexable

▪ [k: `string`]: `unknown`

## Table of contents

### Properties

- [contributors](types_metadata.HypercertClaimdata.md#contributors)
- [impact_scope](types_metadata.HypercertClaimdata.md#impact_scope)
- [impact_timeframe](types_metadata.HypercertClaimdata.md#impact_timeframe)
- [rights](types_metadata.HypercertClaimdata.md#rights)
- [work_scope](types_metadata.HypercertClaimdata.md#work_scope)
- [work_timeframe](types_metadata.HypercertClaimdata.md#work_timeframe)

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

[sdk/src/types/metadata.d.ts:92](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L92)

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

[sdk/src/types/metadata.d.ts:54](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L54)

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

[sdk/src/types/metadata.d.ts:83](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L83)

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

[sdk/src/types/metadata.d.ts:101](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L101)

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

[sdk/src/types/metadata.d.ts:64](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L64)

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

[sdk/src/types/metadata.d.ts:74](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L74)
