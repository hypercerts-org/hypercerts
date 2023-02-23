[@hypercerts-org/hypercerts-sdk](../README.md) / [Exports](../modules.md) / HypercertMetadata

# Interface: HypercertMetadata

Claim data for hypercert. ERC1155 Metadata compliant

## Table of contents

### Properties

- [allowList](HypercertMetadata.md#allowlist)
- [description](HypercertMetadata.md#description)
- [external\_url](HypercertMetadata.md#external_url)
- [hypercert](HypercertMetadata.md#hypercert)
- [image](HypercertMetadata.md#image)
- [name](HypercertMetadata.md#name)
- [properties](HypercertMetadata.md#properties)
- [ref](HypercertMetadata.md#ref)
- [version](HypercertMetadata.md#version)

## Properties

### allowList

• `Optional` **allowList**: `string`

A CID pointer to the merke tree proof json on ipfs

#### Defined in

src/types/metadata.d.ts:39

___

### description

• **description**: `string`

Describes the asset to which this token represents

#### Defined in

src/types/metadata.d.ts:19

___

### external\_url

• `Optional` **external\_url**: `string`

An url pointing to the external website of the project

#### Defined in

src/types/metadata.d.ts:23

___

### hypercert

• `Optional` **hypercert**: `any`

#### Defined in

src/types/metadata.d.ts:45

___

### image

• **image**: `string`

A URI pointing to a resource with mime type image/* representing the asset to which this token represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.

#### Defined in

src/types/metadata.d.ts:27

___

### name

• **name**: `string`

Identifies the asset to which this token represents

#### Defined in

src/types/metadata.d.ts:15

___

### properties

• **properties**: { `[k: string]`: `unknown`; `trait_type?`: `string` ; `value?`: `string`  }[]

#### Defined in

src/types/metadata.d.ts:40

___

### ref

• `Optional` **ref**: `string`

Describes the asset to which this token represents

#### Defined in

src/types/metadata.d.ts:35

___

### version

• `Optional` **version**: `string`

The version of Hypercert schema used to describe this hypercert

#### Defined in

src/types/metadata.d.ts:31
