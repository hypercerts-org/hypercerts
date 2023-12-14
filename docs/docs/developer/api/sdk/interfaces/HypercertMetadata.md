---
id: "HypercertMetadata"
title: "Interface: HypercertMetadata"
sidebar_label: "HypercertMetadata"
sidebar_position: 0
custom_edit_url: null
---

Claim data for hypercert. ERC1155 Metadata compliant

## Properties

### allowList

• `Optional` **allowList**: `string`

A CID pointer to the merke tree proof json on ipfs

#### Defined in

[sdk/src/types/metadata.d.ts:39](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L39)

___

### description

• **description**: `string`

Describes the asset to which this token represents

#### Defined in

[sdk/src/types/metadata.d.ts:19](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L19)

___

### external\_url

• `Optional` **external\_url**: `string`

An url pointing to the external website of the project

#### Defined in

[sdk/src/types/metadata.d.ts:23](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L23)

___

### hypercert

• `Optional` **hypercert**: `HypercertClaimdata`

#### Defined in

[sdk/src/types/metadata.d.ts:45](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L45)

___

### image

• **image**: `string`

A URI pointing to a resource with mime type image/* representing the asset to which this token represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.

#### Defined in

[sdk/src/types/metadata.d.ts:27](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L27)

___

### name

• **name**: `string`

Identifies the asset to which this token represents

#### Defined in

[sdk/src/types/metadata.d.ts:15](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L15)

___

### properties

• `Optional` **properties**: \{ `[k: string]`: `unknown`; `trait_type?`: `string` ; `value?`: `string`  }[]

#### Defined in

[sdk/src/types/metadata.d.ts:40](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L40)

___

### ref

• `Optional` **ref**: `string`

Describes the asset to which this token represents

#### Defined in

[sdk/src/types/metadata.d.ts:35](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L35)

___

### version

• `Optional` **version**: `string`

The version of Hypercert schema used to describe this hypercert

#### Defined in

[sdk/src/types/metadata.d.ts:31](https://github.com/hypercerts-org/hypercerts/blob/9478e99/sdk/src/types/metadata.d.ts#L31)
