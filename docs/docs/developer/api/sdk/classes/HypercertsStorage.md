---
id: "HypercertsStorage"
title: "Class: HypercertsStorage"
sidebar_label: "HypercertsStorage"
sidebar_position: 0
custom_edit_url: null
---

A class that provides storage functionality for Hypercerts.

This class implements the `HypercertStorageInterface` and provides methods for storing and retrieving Hypercerts. It uses the NFT Storage and Web3 Storage APIs for storage, and can be configured to be read-only.

**`Example`**

```ts
const storage = new HypercertsStorage({
  nftStorageToken: "your-nft-storage-token",
  web3StorageToken: "your-web3-storage-token",
});
const metadata = await storage.getMetadata("your-hypercert-id");
```

## Implements

- [`HypercertStorageInterface`](../interfaces/HypercertStorageInterface.md)

## Constructors

### constructor

• **new HypercertsStorage**(`overrides`): [`HypercertsStorage`](HypercertsStorage.md)

Creates a new instance of the `HypercertsStorage` class.

This constructor takes an optional `overrides` parameter that can be used to override the default configuration. If the NFT Storage or Web3 Storage API keys are missing or invalid, the storage will be read-only.

#### Parameters

| Name        | Type                                                                         | Description                                  |
| :---------- | :--------------------------------------------------------------------------- | :------------------------------------------- |
| `overrides` | `Partial`<[`HypercertStorageConfig`](../modules.md#hypercertstorageconfig)\> | The configuration overrides for the storage. |

#### Returns

[`HypercertsStorage`](HypercertsStorage.md)

#### Defined in

[sdk/src/storage.ts:47](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/storage.ts#L47)

## Properties

### nftStorageClient

• `Optional` **nftStorageClient**: `NFTStorage`

The NFT Storage client used for storing and retrieving Hypercerts.

#### Defined in

[sdk/src/storage.ts:36](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/storage.ts#L36)

---

### readonly

• **readonly**: `boolean` = `true`

Whether the storage is read-only. If true, the storage methods will not perform any write operations.

#### Defined in

[sdk/src/storage.ts:34](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/storage.ts#L34)

---

### web3StorageClient

• `Optional` **web3StorageClient**: `Web3Storage`

The Web3 Storage client used for storing and retrieving Hypercerts.

#### Defined in

[sdk/src/storage.ts:38](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/storage.ts#L38)

## Methods

### getData

▸ **getData**(`cidOrIpfsUri`): `Promise`<`unknown`\>

Retrieves data from IPFS using the provided CID or IPFS URI.

This method first retrieves the data from IPFS using the `getFromIPFS` function. It then parses the retrieved data as JSON and returns it.

#### Parameters

| Name           | Type     | Description                                  |
| :------------- | :------- | :------------------------------------------- |
| `cidOrIpfsUri` | `string` | The CID or IPFS URI of the data to retrieve. |

#### Returns

`Promise`<`unknown`\>

A promise that resolves to the retrieved data.

**`Throws`**

Will throw a `FetchError` if the retrieval operation fails.

**`Throws`**

Will throw a `MalformedDataError` if the retrieved data is not a single file.

**`Remarkts`**

Note: The original implementation using the Web3 Storage client is currently commented out due to issues with upstream repos. This will be replaced once those issues are resolved.

#### Implementation of

[HypercertStorageInterface](../interfaces/HypercertStorageInterface.md).[getData](../interfaces/HypercertStorageInterface.md#getdata)

#### Defined in

[sdk/src/storage.ts:167](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/storage.ts#L167)

---

### getMetadata

▸ **getMetadata**(`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

Retrieves Hypercert metadata from IPFS using the provided CID or IPFS URI.

This method first retrieves the data from IPFS using the `getFromIPFS` function. It then validates the retrieved data using the `validateMetaData` function. If the data is invalid, it throws a `MalformedDataError`.
If the data is valid, it returns the data as a `HypercertMetadata` object.

#### Parameters

| Name           | Type     | Description                                      |
| :------------- | :------- | :----------------------------------------------- |
| `cidOrIpfsUri` | `string` | The CID or IPFS URI of the metadata to retrieve. |

#### Returns

`Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

A promise that resolves to the retrieved metadata.

**`Throws`**

Will throw a `MalformedDataError` if the retrieved data is invalid.

#### Implementation of

[HypercertStorageInterface](../interfaces/HypercertStorageInterface.md).[getMetadata](../interfaces/HypercertStorageInterface.md#getmetadata)

#### Defined in

[sdk/src/storage.ts:114](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/storage.ts#L114)

---

### storeData

▸ **storeData**(`data`): `Promise`<`CIDString`\>

Stores data using the Web3 Storage client.

This method first checks if the storage is read-only or if the Web3 Storage client is not configured. If either of these conditions is true, it throws a `StorageError`.
It then creates a new Blob from the provided data and stores it using the Web3 Storage client. If the storage operation fails, it throws a `StorageError`.

#### Parameters

| Name   | Type      | Description                                      |
| :----- | :-------- | :----------------------------------------------- |
| `data` | `unknown` | The data to store. This can be any type of data. |

#### Returns

`Promise`<`CIDString`\>

A promise that resolves to the CID of the stored data.

**`Throws`**

Will throw a `StorageError` if the storage is read-only, if the Web3 Storage client is not configured, or if the storage operation fails.

**`Remarks`**

Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob.
Because we pay for storage quotas, this data is stored best effort.
If you are using our default keys, we may delete older data if we hit our storage quota.

#### Implementation of

[HypercertStorageInterface](../interfaces/HypercertStorageInterface.md).[storeData](../interfaces/HypercertStorageInterface.md#storedata)

#### Defined in

[sdk/src/storage.ts:139](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/storage.ts#L139)

---

### storeMetadata

▸ **storeMetadata**(`data`): `Promise`<`CIDString`\>

Stores Hypercert metadata using the NFT Storage client.

This method first checks if the storage is read-only or if the NFT Storage client is not configured. If either of these conditions is true, it throws a `StorageError`.
It then validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`.
If the metadata is valid, it creates a new Blob from the metadata and stores it using the NFT Storage client. If the storage operation fails, it throws a `StorageError`.

#### Parameters

| Name   | Type                                                      | Description                                                                                            |
| :----- | :-------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `data` | [`HypercertMetadata`](../interfaces/HypercertMetadata.md) | The Hypercert metadata to store. This should be an object that conforms to the HypercertMetadata type. |

#### Returns

`Promise`<`CIDString`\>

A promise that resolves to the CID of the stored metadata.

**`Throws`**

Will throw a `StorageError` if the storage is read-only, if the NFT Storage client is not configured, or if the storage operation fails.

**`Throws`**

Will throw a `MalformedDataError` if the provided metadata is invalid.

#### Implementation of

[HypercertStorageInterface](../interfaces/HypercertStorageInterface.md).[storeMetadata](../interfaces/HypercertStorageInterface.md#storemetadata)

#### Defined in

[sdk/src/storage.ts:81](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/storage.ts#L81)
