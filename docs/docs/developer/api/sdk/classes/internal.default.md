[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [internal](../modules/internal.md) / default

# Class: default

[internal](../modules/internal.md).default

A class that provides storage functionality for Hypercerts.

## Implements

- [`HypercertStorageInterface`](../interfaces/HypercertStorageInterface.md)

## Table of contents

### Constructors

- [constructor](internal.default.md#constructor)

### Properties

- [nftStorageClient](internal.default.md#nftstorageclient)
- [readonly](internal.default.md#readonly)
- [web3StorageClient](internal.default.md#web3storageclient)

### Methods

- [getData](internal.default.md#getdata)
- [getMetadata](internal.default.md#getmetadata)
- [getNftStorageGatewayUri](internal.default.md#getnftstoragegatewayuri)
- [storeData](internal.default.md#storedata)
- [storeMetadata](internal.default.md#storemetadata)

## Constructors

### constructor

• **new default**(`overrides`)

Creates a new instance of the `HypercertsStorage` class.

#### Parameters

| Name        | Type                                                                         | Description                                  |
| :---------- | :--------------------------------------------------------------------------- | :------------------------------------------- |
| `overrides` | `Partial`<[`HypercertStorageConfig`](../modules.md#hypercertstorageconfig)\> | The configuration overrides for the storage. |

#### Defined in

[sdk/src/storage.ts:37](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L37)

## Properties

### nftStorageClient

• `Optional` **nftStorageClient**: `NFTStorage`

The NFT storage client.

#### Defined in

[sdk/src/storage.ts:29](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L29)

---

### readonly

• **readonly**: `boolean` = `true`

Whether the storage is read-only.

#### Defined in

[sdk/src/storage.ts:27](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L27)

---

### web3StorageClient

• `Optional` **web3StorageClient**: `any`

The Web3 storage client.

#### Defined in

[sdk/src/storage.ts:31](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L31)

## Methods

### getData

▸ **getData**(`cidOrIpfsUri`): `Promise`<`any`\>

Gets arbitrary data from Web3 storage.

**`Throws`**

A `StorageError` if the storage client is not configured or the data cannot be retrieved.

#### Parameters

| Name           | Type     | Description                             |
| :------------- | :------- | :-------------------------------------- |
| `cidOrIpfsUri` | `string` | The CID or IPFS URI of the data to get. |

#### Returns

`Promise`<`any`\>

A Promise that resolves to the data.

#### Implementation of

HypercertStorageInterface.getData

#### Defined in

[sdk/src/storage.ts:147](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L147)

---

### getMetadata

▸ **getMetadata**(`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

Gets metadata for a Hypercert.

**`Throws`**

A `StorageError` if the storage client is not configured or the metadata cannot be retrieved.

**`Throws`**

A `MalformedDataError` if the metadata is invalid. E.g. unknown schema

#### Parameters

| Name           | Type     | Description                                 |
| :------------- | :------- | :------------------------------------------ |
| `cidOrIpfsUri` | `string` | The CID or IPFS URI of the metadata to get. |

#### Returns

`Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

A Promise that resolves to the metadata.

#### Implementation of

HypercertStorageInterface.getMetadata

#### Defined in

[sdk/src/storage.ts:97](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L97)

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

[sdk/src/storage.ts:181](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L181)

---

### storeData

▸ **storeData**(`data`): `Promise`<`CIDString`\>

Stores arbitrary data in Web3 storage.

**`Throws`**

A `StorageError` if the storage client is not configured.

**`Notice`**

Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob.
Because we pay for storage quotas, this data is stored best effort.
If you are using our default keys, we may delete older data if we hit our storage quota.

#### Parameters

| Name   | Type      | Description        |
| :----- | :-------- | :----------------- |
| `data` | `unknown` | The data to store. |

#### Returns

`Promise`<`CIDString`\>

A Promise that resolves to the CID of the stored data.

#### Implementation of

HypercertStorageInterface.storeData

#### Defined in

[sdk/src/storage.ts:125](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L125)

---

### storeMetadata

▸ **storeMetadata**(`data`): `Promise`<`CIDString`\>

Stores metadata for a Hypercert.

**`Throws`**

A `StorageError` if the storage client is not configured.

**`Throws`**

A `MalformedDataError` if the metadata is invalid.

**`Notice`**

Because we pay for storage quotas, this data is stored best effort.
If you are using our default keys, we may delete older data if we hit our storage quota.

#### Parameters

| Name   | Type                                                      | Description            |
| :----- | :-------------------------------------------------------- | :--------------------- |
| `data` | [`HypercertMetadata`](../interfaces/HypercertMetadata.md) | The metadata to store. |

#### Returns

`Promise`<`CIDString`\>

A Promise that resolves to the CID of the stored metadata.

#### Implementation of

HypercertStorageInterface.storeMetadata

#### Defined in

[sdk/src/storage.ts:67](https://github.com/Network-Goods/hypercerts/blob/1e395d9/sdk/src/storage.ts#L67)
