[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / validator

# Module: validator

## Table of contents

### Functions

- [validateAllowlist](validator.md#validateallowlist)
- [validateClaimData](validator.md#validateclaimdata)
- [validateMetaData](validator.md#validatemetadata)

## Functions

### validateAllowlist

▸ **validateAllowlist**(`data`, `units`): `Object`

#### Parameters

| Name    | Type                                         |
| :------ | :------------------------------------------- |
| `data`  | [`Allowlist`](types_hypercerts.md#allowlist) |
| `units` | `BigNumberish`                               |

#### Returns

`Object`

| Name     | Type                                        |
| :------- | :------------------------------------------ |
| `errors` | `Record`<`string`, `string` \| `string`[]\> |
| `valid`  | `boolean`                                   |

#### Defined in

[sdk/src/validator/index.ts:62](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/validator/index.ts#L62)

---

### validateClaimData

▸ **validateClaimData**(`data`): `ValidationResult`

#### Parameters

| Name   | Type                                                                        |
| :----- | :-------------------------------------------------------------------------- |
| `data` | [`HypercertClaimdata`](../interfaces/types_claimdata.HypercertClaimdata.md) |

#### Returns

`ValidationResult`

#### Defined in

[sdk/src/validator/index.ts:41](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/validator/index.ts#L41)

---

### validateMetaData

▸ **validateMetaData**(`data`): `ValidationResult`

#### Parameters

| Name   | Type                                                                     |
| :----- | :----------------------------------------------------------------------- |
| `data` | [`HypercertMetadata`](../interfaces/types_metadata.HypercertMetadata.md) |

#### Returns

`ValidationResult`

#### Defined in

[sdk/src/validator/index.ts:20](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/validator/index.ts#L20)
