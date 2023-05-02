[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/metadata](../modules/types_metadata.md) / HypercertMetadata

# Interface: HypercertMetadata

[types/metadata](../modules/types_metadata.md).HypercertMetadata

Claim data for hypercert. ERC1155 Metadata compliant

## Table of contents

### Properties

- [allowList](types_metadata.HypercertMetadata.md#allowlist)
- [description](types_metadata.HypercertMetadata.md#description)
- [external_url](types_metadata.HypercertMetadata.md#external_url)
- [hypercert](types_metadata.HypercertMetadata.md#hypercert)
- [image](types_metadata.HypercertMetadata.md#image)
- [name](types_metadata.HypercertMetadata.md#name)
- [properties](types_metadata.HypercertMetadata.md#properties)
- [ref](types_metadata.HypercertMetadata.md#ref)
- [version](types_metadata.HypercertMetadata.md#version)

## Properties

### allowList

• `Optional` **allowList**: `string`

A CID pointer to the merke tree proof json on ipfs

#### Defined in

[sdk/src/types/metadata.d.ts:39](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L39)

---

### description

• **description**: `string`

Describes the asset to which this token represents

#### Defined in

[sdk/src/types/metadata.d.ts:19](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L19)

---

### external_url

• `Optional` **external_url**: `string`

An url pointing to the external website of the project

#### Defined in

[sdk/src/types/metadata.d.ts:23](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L23)

---

### hypercert

• `Optional` **hypercert**: [`HypercertClaimdata`](types_metadata.HypercertClaimdata.md)

#### Defined in

[sdk/src/types/metadata.d.ts:45](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L45)

---

### image

• **image**: `string`

A URI pointing to a resource with mime type image/\* representing the asset to which this token represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.

#### Defined in

[sdk/src/types/metadata.d.ts:27](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L27)

---

### name

• **name**: `string`

Identifies the asset to which this token represents

#### Defined in

[sdk/src/types/metadata.d.ts:15](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L15)

---

### properties

• `Optional` **properties**: { `[k: string]`: `unknown`; `trait_type?`: `string` ; `value?`: `string` }[]

#### Defined in

[sdk/src/types/metadata.d.ts:40](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L40)

---

### ref

• `Optional` **ref**: `string`

Describes the asset to which this token represents

#### Defined in

[sdk/src/types/metadata.d.ts:35](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L35)

---

### version

• `Optional` **version**: `string`

The version of Hypercert schema used to describe this hypercert

#### Defined in

[sdk/src/types/metadata.d.ts:31](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/metadata.d.ts#L31)
