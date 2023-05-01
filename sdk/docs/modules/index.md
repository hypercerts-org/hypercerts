[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / index

# Module: index

## Table of contents

### References

- [Allowlist](index.md#allowlist)
- [AllowlistEntry](index.md#allowlistentry)
- [ClaimByIdQuery](index.md#claimbyidquery)
- [ClaimTokensByClaimQuery](index.md#claimtokensbyclaimquery)
- [HypercertClaimdata](index.md#hypercertclaimdata)
- [HypercertClient](index.md#hypercertclient)
- [HypercertMetadata](index.md#hypercertmetadata)
- [HypercertMinterABI](index.md#hypercertminterabi)
- [HypercertMinting](index.md#hypercertminting)
- [HypercertsStorage](index.md#hypercertsstorage)
- [TransferRestrictions](index.md#transferrestrictions)
- [claimById](index.md#claimbyid)
- [claimsByOwner](index.md#claimsbyowner)
- [firstClaims](index.md#firstclaims)
- [formatHypercertData](index.md#formathypercertdata)
- [fractionById](index.md#fractionbyid)
- [fractionsByClaim](index.md#fractionsbyclaim)
- [fractionsByOwner](index.md#fractionsbyowner)
- [validateAllowlist](index.md#validateallowlist)
- [validateClaimData](index.md#validateclaimdata)
- [validateMetaData](index.md#validatemetadata)

### Variables

- [HyperCertMinterFactory](index.md#hypercertminterfactory)

### Functions

- [execute](index.md#execute)

## References

### Allowlist

Re-exports [Allowlist](types_hypercerts.md#allowlist)

---

### AllowlistEntry

Re-exports [AllowlistEntry](types_hypercerts.md#allowlistentry)

---

### ClaimByIdQuery

Re-exports [ClaimByIdQuery](global.md#claimbyidquery)

---

### ClaimTokensByClaimQuery

Re-exports [ClaimTokensByClaimQuery](global.md#claimtokensbyclaimquery)

---

### HypercertClaimdata

Re-exports [HypercertClaimdata](../interfaces/types_claimdata.HypercertClaimdata.md)

---

### HypercertClient

Renames and re-exports [default](../classes/client.default.md)

---

### HypercertMetadata

Re-exports [HypercertMetadata](../interfaces/types_metadata.HypercertMetadata.md)

---

### HypercertMinterABI

Renames and re-exports [default](resources_HypercertMinter.md#default)

---

### HypercertMinting

Renames and re-exports [default](operator_hypercerts_minting.md#default)

---

### HypercertsStorage

Renames and re-exports [default](../classes/operator_hypercerts_storage.default.md)

---

### TransferRestrictions

Re-exports [TransferRestrictions](../enums/types_hypercerts.TransferRestrictions.md)

---

### claimById

Re-exports [claimById](queries_claims.md#claimbyid)

---

### claimsByOwner

Re-exports [claimsByOwner](queries_claims.md#claimsbyowner)

---

### firstClaims

Re-exports [firstClaims](queries_claims.md#firstclaims)

---

### formatHypercertData

Re-exports [formatHypercertData](utils_formatter.md#formathypercertdata)

---

### fractionById

Re-exports [fractionById](queries_fractions.md#fractionbyid)

---

### fractionsByClaim

Re-exports [fractionsByClaim](queries_fractions.md#fractionsbyclaim)

---

### fractionsByOwner

Re-exports [fractionsByOwner](queries_fractions.md#fractionsbyowner)

---

### validateAllowlist

Re-exports [validateAllowlist](validator.md#validateallowlist)

---

### validateClaimData

Re-exports [validateClaimData](validator.md#validateclaimdata)

---

### validateMetaData

Re-exports [validateMetaData](validator.md#validatemetadata)

## Variables

### HyperCertMinterFactory

• **HyperCertMinterFactory**: typeof `HypercertMinter__factory`

#### Defined in

[sdk/src/index.ts:31](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/index.ts#L31)

## Functions

### execute

▸ **execute**(`document`, `variables`, `context?`, `rootValue?`, `operationName?`): `Promise`<`ExecutionResult`<`any`,
`ObjMap`<`unknown`\>\>\>

#### Parameters

| Name             | Type                              |
| :--------------- | :-------------------------------- |
| `document`       | `GraphQLOperation`<`any`, `any`\> |
| `variables`      | `any`                             |
| `context?`       | `any`                             |
| `rootValue?`     | `any`                             |
| `operationName?` | `string`                          |

#### Returns

`Promise`<`ExecutionResult`<`any`, `ObjMap`<`unknown`\>\>\>

#### Defined in

node_modules/@graphql-mesh/runtime/typings/types.d.ts:25
