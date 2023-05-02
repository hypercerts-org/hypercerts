[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [storage](../modules/storage.md) / default

# Class: default

[storage](../modules/storage.md).default

Client wrapper for Web3.storage and NFT.storage

## Implements

- [`HypercertStorageInterface`](../interfaces/types_client.HypercertStorageInterface.md)

## Table of contents

### Constructors

- [constructor](storage.default.md#constructor)

### Properties

- [nftStorageClient](storage.default.md#nftstorageclient)
- [readonly](storage.default.md#readonly)
- [web3StorageClient](storage.default.md#web3storageclient)

### Methods

- [getData](storage.default.md#getdata)
- [getMetadata](storage.default.md#getmetadata)
- [getNftStorageGatewayUri](storage.default.md#getnftstoragegatewayuri)
- [storeData](storage.default.md#storedata)
- [storeMetadata](storage.default.md#storemetadata)

## Constructors

### constructor

• **new default**(`«destructured»`)

#### Parameters

| Name             | Type                                                                        |
| :--------------- | :-------------------------------------------------------------------------- |
| `«destructured»` | [`HypercertStorageProps`](../modules/types_client.md#hypercertstorageprops) |

#### Defined in

[sdk/src/storage.ts:25](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L25)

## Properties

### nftStorageClient

• `Optional` **nftStorageClient**: `NFTStorage`

#### Defined in

[sdk/src/storage.ts:22](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L22)

---

### readonly

• **readonly**: `boolean` = `true`

#### Defined in

[sdk/src/storage.ts:21](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L21)

---

### web3StorageClient

• `Optional` **web3StorageClient**: `any`

#### Defined in

[sdk/src/storage.ts:23](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L23)

## Methods

### getData

▸ **getData**(`cidOrIpfsUri`): `Promise`<`any`\>

Get arbitrary data from web3.storage. Use with caution because there's no guarantee that the data will be there or safe.

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `cidOrIpfsUri` | `string` |

#### Returns

`Promise`<`any`\>

JSON data or error

#### Implementation of

HypercertStorageInterface.getData

#### Defined in

[sdk/src/storage.ts:131](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L131)

---

### getMetadata

▸ **getMetadata**(`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](../interfaces/types_metadata.HypercertMetadata.md)\>

Retrieves NFT metadata from NFT.storage

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `cidOrIpfsUri` | `string` |

#### Returns

`Promise`<[`HypercertMetadata`](../interfaces/types_metadata.HypercertMetadata.md)\>

#### Implementation of

HypercertStorageInterface.getMetadata

#### Defined in

[sdk/src/storage.ts:82](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L82)

---

### getNftStorageGatewayUri

▸ **getNftStorageGatewayUri**(`cidOrIpfsUri`): `string`

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `cidOrIpfsUri` | `string` |

#### Returns

`string`

#### Defined in

[sdk/src/storage.ts:165](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L165)

---

### storeData

▸ **storeData**(`data`): `Promise`<`CIDString`\>

Store arbitrary JSON data into web3.storage

- Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob
- Because we pay for storage quotas, this data is stored best effort.
- If you are using our default keys, we may delete older data if we hit our storage quota

#### Parameters

| Name   | Type      |
| :----- | :-------- |
| `data` | `unknown` |

#### Returns

`Promise`<`CIDString`\>

#### Implementation of

HypercertStorageInterface.storeData

#### Defined in

[sdk/src/storage.ts:110](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L110)

---

### storeMetadata

▸ **storeMetadata**(`data`): `Promise`<`CIDString`\>

Stores NFT metadata into NFT.storage

#### Parameters

| Name   | Type                                                                     |
| :----- | :----------------------------------------------------------------------- |
| `data` | [`HypercertMetadata`](../interfaces/types_metadata.HypercertMetadata.md) |

#### Returns

`Promise`<`CIDString`\>

#### Implementation of

HypercertStorageInterface.storeMetadata

#### Defined in

[sdk/src/storage.ts:54](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/storage.ts#L54)
