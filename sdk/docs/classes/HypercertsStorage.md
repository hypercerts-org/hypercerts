[@hypercerts-org/hypercerts-sdk](../README.md) / [Exports](../modules.md) / HypercertsStorage

# Class: HypercertsStorage

## Table of contents

### Constructors

- [constructor](HypercertsStorage.md#constructor)

### Properties

- [config](HypercertsStorage.md#config)
- [nftStorageClient](HypercertsStorage.md#nftstorageclient)
- [web3StorageClient](HypercertsStorage.md#web3storageclient)

### Methods

- [getData](HypercertsStorage.md#getdata)
- [getMetadata](HypercertsStorage.md#getmetadata)
- [storeData](HypercertsStorage.md#storedata)
- [storeMetadata](HypercertsStorage.md#storemetadata)

## Constructors

### constructor

• **new HypercertsStorage**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `HypercertsStorageConfig` |

#### Defined in

[src/operator/hypercerts-storage.ts:24](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/hypercerts-storage.ts#L24)

## Properties

### config

• `Private` **config**: `HypercertsStorageConfig`

#### Defined in

[src/operator/hypercerts-storage.ts:24](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/hypercerts-storage.ts#L24)

___

### nftStorageClient

• `Private` **nftStorageClient**: `NFTStorage`

#### Defined in

[src/operator/hypercerts-storage.ts:21](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/hypercerts-storage.ts#L21)

___

### web3StorageClient

• `Private` **web3StorageClient**: `Web3Storage`

#### Defined in

[src/operator/hypercerts-storage.ts:22](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/hypercerts-storage.ts#L22)

## Methods

### getData

▸ **getData**(`cidOrIpfsUri`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cidOrIpfsUri` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/operator/hypercerts-storage.ts:45](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/hypercerts-storage.ts#L45)

___

### getMetadata

▸ **getMetadata**(`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cidOrIpfsUri` | `string` |

#### Returns

`Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

#### Defined in

[src/operator/hypercerts-storage.ts:37](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/hypercerts-storage.ts#L37)

___

### storeData

▸ **storeData**(`data`): `Promise`<`CIDString`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |

#### Returns

`Promise`<`CIDString`\>

#### Defined in

[src/operator/hypercerts-storage.ts:41](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/hypercerts-storage.ts#L41)

___

### storeMetadata

▸ **storeMetadata**(`data`): `Promise`<`CIDString`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`HypercertMetadata`](../interfaces/HypercertMetadata.md) |

#### Returns

`Promise`<`CIDString`\>

#### Defined in

[src/operator/hypercerts-storage.ts:33](https://github.com/Network-Goods/hypercerts/blob/ece3cf1/sdk/src/operator/hypercerts-storage.ts#L33)
