[@hypercerts-org/hypercerts-sdk](../README.md) / [Exports](../modules.md) / HypercertsStorage

# Class: HypercertsStorage

## Table of contents

### Constructors

- [constructor](HypercertsStorage.md#constructor)

### Properties

- [nftStorageClient](HypercertsStorage.md#nftstorageclient)
- [web3StorageClient](HypercertsStorage.md#web3storageclient)

### Methods

- [getData](HypercertsStorage.md#getdata)
- [getMetadata](HypercertsStorage.md#getmetadata)
- [getNftStorageGatewayUri](HypercertsStorage.md#getnftstoragegatewayuri)
- [storeData](HypercertsStorage.md#storedata)
- [storeMetadata](HypercertsStorage.md#storemetadata)

## Constructors

### constructor

• **new HypercertsStorage**(`«destructured»`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `HypercertStorageProps` |

#### Defined in

[src/operator/hypercerts-storage.ts:20](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-storage.ts#L20)

## Properties

### nftStorageClient

• **nftStorageClient**: `NFTStorage`

#### Defined in

[src/operator/hypercerts-storage.ts:17](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-storage.ts#L17)

___

### web3StorageClient

• **web3StorageClient**: `Web3Storage`

#### Defined in

[src/operator/hypercerts-storage.ts:18](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-storage.ts#L18)

## Methods

### getData

▸ **getData**(`cidOrIpfsUri`): `Promise`<`any`\>

Get arbitrary data from web3.storage

#### Parameters

| Name | Type |
| :------ | :------ |
| `cidOrIpfsUri` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/operator/hypercerts-storage.ts:75](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-storage.ts#L75)

___

### getMetadata

▸ **getMetadata**(`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

Retrieves NFT metadata from NFT.storage

#### Parameters

| Name | Type |
| :------ | :------ |
| `cidOrIpfsUri` | `string` |

#### Returns

`Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

#### Defined in

[src/operator/hypercerts-storage.ts:48](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-storage.ts#L48)

___

### getNftStorageGatewayUri

▸ **getNftStorageGatewayUri**(`cidOrIpfsUri`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cidOrIpfsUri` | `string` |

#### Returns

`string`

#### Defined in

[src/operator/hypercerts-storage.ts:100](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-storage.ts#L100)

___

### storeData

▸ **storeData**(`data`): `Promise`<`CIDString`\>

Store arbitrary JSON data into web3.storage
- Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob
- Because we pay for storage quotas, this data is stored best effort.
- If you are using our default keys, we may delete older data if we hit our storage quota

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`CIDString`\>

#### Defined in

[src/operator/hypercerts-storage.ts:63](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-storage.ts#L63)

___

### storeMetadata

▸ **storeMetadata**(`data`): `Promise`<`CIDString`\>

Stores NFT metadata into NFT.storage

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`HypercertMetadata`](../interfaces/HypercertMetadata.md) |

#### Returns

`Promise`<`CIDString`\>

#### Defined in

[src/operator/hypercerts-storage.ts:37](https://github.com/Network-Goods/hypercerts/blob/c1e4887/sdk/src/operator/hypercerts-storage.ts#L37)
