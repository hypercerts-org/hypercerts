[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [operator/hypercerts-storage](../modules/operator_hypercerts_storage.md) / default

# Class: default

[operator/hypercerts-storage](../modules/operator_hypercerts_storage.md).default

HypercertsStorage is a wrapper around NFT.storage and web3.storage

**`Deprecated`**

refactored into storage.ts that doesn't throw but enables read only

## Implements

- [`HypercertStorageInterface`](../interfaces/types_client.HypercertStorageInterface.md)

## Table of contents

### Constructors

- [constructor](operator_hypercerts_storage.default.md#constructor)

### Properties

- [nftStorageClient](operator_hypercerts_storage.default.md#nftstorageclient)
- [web3StorageClient](operator_hypercerts_storage.default.md#web3storageclient)

### Methods

- [getData](operator_hypercerts_storage.default.md#getdata)
- [getMetadata](operator_hypercerts_storage.default.md#getmetadata)
- [getNftStorageGatewayUri](operator_hypercerts_storage.default.md#getnftstoragegatewayuri)
- [storeData](operator_hypercerts_storage.default.md#storedata)
- [storeMetadata](operator_hypercerts_storage.default.md#storemetadata)

## Constructors

### constructor

• **new default**(`«destructured»`)

#### Parameters

| Name             | Type                                                                        |
| :--------------- | :-------------------------------------------------------------------------- |
| `«destructured»` | [`HypercertStorageProps`](../modules/types_client.md#hypercertstorageprops) |

#### Defined in

[sdk/src/operator/hypercerts-storage.ts:23](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/operator/hypercerts-storage.ts#L23)

## Properties

### nftStorageClient

• **nftStorageClient**: `NFTStorage`

#### Defined in

[sdk/src/operator/hypercerts-storage.ts:20](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/operator/hypercerts-storage.ts#L20)

---

### web3StorageClient

• **web3StorageClient**: `Web3Storage`

#### Defined in

[sdk/src/operator/hypercerts-storage.ts:21](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/operator/hypercerts-storage.ts#L21)

## Methods

### getData

▸ **getData**(`cidOrIpfsUri`): `Promise`<`any`\>

Get arbitrary data from web3.storage. Use with caution because there's no guarantee that the data will be there or safe.
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

[sdk/src/operator/hypercerts-storage.ts:99](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/operator/hypercerts-storage.ts#L99)

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

[sdk/src/operator/hypercerts-storage.ts:64](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/operator/hypercerts-storage.ts#L64)

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

[sdk/src/operator/hypercerts-storage.ts:133](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/operator/hypercerts-storage.ts#L133)

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

[sdk/src/operator/hypercerts-storage.ts:80](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/operator/hypercerts-storage.ts#L80)

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

[sdk/src/operator/hypercerts-storage.ts:47](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/operator/hypercerts-storage.ts#L47)
