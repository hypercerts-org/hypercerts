---
id: "HypercertsStorage"
title: "Class: HypercertsStorage"
sidebar_label: "HypercertsStorage"
sidebar_position: 0
custom_edit_url: null
---

A class that provides storage functionality for Hypercerts.

This class implements the `HypercertStorageInterface` and provides methods for storing and retrieving Hypercerts.

**`Example`**

```ts
const storage = new HypercertsStorage();
const metadata = await storage.getMetadata("your-hypercert-id");
```

## Implements

- [`HypercertStorageInterface`](../interfaces/HypercertStorageInterface.md)

## Constructors

### constructor

• **new HypercertsStorage**(): [`HypercertsStorage`](HypercertsStorage.md)

#### Returns

[`HypercertsStorage`](HypercertsStorage.md)

## Methods

### getData

▸ **getData**(`cidOrIpfsUri`, `config?`): `Promise`<`unknown`\>

Retrieves data from IPFS using the provided CID or IPFS URI.

This method first retrieves the data from IPFS using the `getFromIPFS` function. It then parses the retrieved data as JSON and returns it.

#### Parameters

| Name           | Type                                                             | Description                                  |
| :------------- | :--------------------------------------------------------------- | :------------------------------------------- |
| `cidOrIpfsUri` | `string`                                                         | The CID or IPFS URI of the data to retrieve. |
| `config?`      | [`StorageConfigOverrides`](../modules.md#storageconfigoverrides) | An optional configuration object.            |

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

[sdk/src/storage.ts:145](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/storage.ts#L145)

---

### getMetadata

▸ **getMetadata**(`cidOrIpfsUri`, `config?`): `Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

Retrieves Hypercert metadata from IPFS using the provided CID or IPFS URI.

This method first retrieves the data from IPFS using the `getFromIPFS` function. It then validates the retrieved data using the `validateMetaData` function. If the data is invalid, it throws a `MalformedDataError`.
If the data is valid, it returns the data as a `HypercertMetadata` object.

#### Parameters

| Name           | Type                                                             | Description                                      |
| :------------- | :--------------------------------------------------------------- | :----------------------------------------------- |
| `cidOrIpfsUri` | `string`                                                         | The CID or IPFS URI of the metadata to retrieve. |
| `config?`      | [`StorageConfigOverrides`](../modules.md#storageconfigoverrides) | An optional configuration object.                |

#### Returns

`Promise`<[`HypercertMetadata`](../interfaces/HypercertMetadata.md)\>

A promise that resolves to the retrieved metadata.

**`Throws`**

Will throw a `MalformedDataError` if the retrieved data is invalid.

#### Implementation of

[HypercertStorageInterface](../interfaces/HypercertStorageInterface.md).[getMetadata](../interfaces/HypercertStorageInterface.md#getmetadata)

#### Defined in

[sdk/src/storage.ts:118](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/storage.ts#L118)

---

### storeAllowList

▸ **storeAllowList**(`allowList`, `totalUnits`, `config?`): `Promise`<`string`\>

Stores hypercerts allowlist on IPFS.

First it validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`.
If the metadata is valid, it creates a new Blob from the metadata and stores it using the hypercerts API. If the storage operation fails, it throws a `StorageError`.

#### Parameters

| Name         | Type                                                             | Description                                 |
| :----------- | :--------------------------------------------------------------- | :------------------------------------------ |
| `allowList`  | [`AllowlistEntry`](../modules.md#allowlistentry)[]               | The allowList to store.                     |
| `totalUnits` | `bigint`                                                         | The total number of units in the allowlist. |
| `config?`    | [`StorageConfigOverrides`](../modules.md#storageconfigoverrides) | An optional configuration object.           |

#### Returns

`Promise`<`string`\>

A promise that resolves to the CID of the stored metadata.

**`Throws`**

Will throw a `StorageError` if the storage operation fails.

**`Throws`**

Will throw a `MalformedDataError` if the provided metadata is invalid.

#### Implementation of

[HypercertStorageInterface](../interfaces/HypercertStorageInterface.md).[storeAllowList](../interfaces/HypercertStorageInterface.md#storeallowlist)

#### Defined in

[sdk/src/storage.ts:36](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/storage.ts#L36)

---

### storeMetadata

▸ **storeMetadata**(`metadata`, `config?`): `Promise`<`string`\>

Stores Hypercert metadata using the hypercerts API.

It then validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`.
If the metadata is valid, it creates a new Blob from the metadata and stores it using the hypercerts API. If the storage operation fails, it throws a `StorageError`.

#### Parameters

| Name       | Type                                                             | Description                       |
| :--------- | :--------------------------------------------------------------- | :-------------------------------- |
| `metadata` | [`HypercertMetadata`](../interfaces/HypercertMetadata.md)        | -                                 |
| `config?`  | [`StorageConfigOverrides`](../modules.md#storageconfigoverrides) | An optional configuration object. |

#### Returns

`Promise`<`string`\>

A promise that resolves to the CID of the stored metadata.

**`Throws`**

Will throw a `StorageError` if the storage operation fails.

**`Throws`**

Will throw a `MalformedDataError` if the provided metadata is invalid.

#### Implementation of

[HypercertStorageInterface](../interfaces/HypercertStorageInterface.md).[storeMetadata](../interfaces/HypercertStorageInterface.md#storemetadata)

#### Defined in

[sdk/src/storage.ts:83](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/storage.ts#L83)
