[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / utils/formatter

# Module: utils/formatter

## Table of contents

### Variables

- [INDEFINITE_DATE_STRING](utils_formatter.md#indefinite_date_string)

### Functions

- [formatDate](utils_formatter.md#formatdate)
- [formatHypercertData](utils_formatter.md#formathypercertdata)
- [formatUnixTime](utils_formatter.md#formatunixtime)

## Variables

### INDEFINITE_DATE_STRING

• `Const` **INDEFINITE_DATE_STRING**: `"indefinite"`

#### Defined in

[sdk/src/utils/formatter.ts:5](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/utils/formatter.ts#L5)

## Functions

### formatDate

▸ **formatDate**(`date`): `string`

#### Parameters

| Name   | Type   |
| :----- | :----- |
| `date` | `Date` |

#### Returns

`string`

#### Defined in

[sdk/src/utils/formatter.ts:14](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/utils/formatter.ts#L14)

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

[sdk/src/utils/formatter.ts:28](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/utils/formatter.ts#L28)

---

### formatUnixTime

▸ **formatUnixTime**(`seconds`): `string`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `seconds` | `number` |

#### Returns

`string`

#### Defined in

[sdk/src/utils/formatter.ts:6](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/utils/formatter.ts#L6)
