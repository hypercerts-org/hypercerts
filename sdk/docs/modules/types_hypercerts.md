[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / types/hypercerts

# Module: types/hypercerts

## Table of contents

### Enumerations

- [TransferRestrictions](../enums/types_hypercerts.TransferRestrictions.md)

### Type Aliases

- [Allowlist](types_hypercerts.md#allowlist)
- [AllowlistEntry](types_hypercerts.md#allowlistentry)

## Type Aliases

### Allowlist

Ƭ **Allowlist**: [`AllowlistEntry`](types_hypercerts.md#allowlistentry)[]

Helper type to allow for a more readable Allowlist type

#### Defined in

[sdk/src/types/hypercerts.ts:28](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/hypercerts.ts#L28)

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

[sdk/src/types/hypercerts.ts:20](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/hypercerts.ts#L20)
