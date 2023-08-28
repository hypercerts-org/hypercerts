[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertStorageInterface

# Interface: HypercertStorageInterface

The interface for the Hypercert storage layer.

## Implemented by

- [`HypercertsStorage`](../classes/HypercertsStorage.md)

## Table of contents

### Properties

- [getData](HypercertStorageInterface.md#getdata)
- [getMetadata](HypercertStorageInterface.md#getmetadata)
- [storeData](HypercertStorageInterface.md#storedata)
- [storeMetadata](HypercertStorageInterface.md#storemetadata)

## Properties

### getData

• **getData**: (`cidOrIpfsUri`: `string`) => `Promise`<`unknown`\>

#### Type declaration

▸ (`cidOrIpfsUri`): `Promise`<`unknown`\>

Retrieves arbitrary data from IPFS.

##### Parameters

| Name           | Type     | Description                                  |
| :------------- | :------- | :------------------------------------------- |
| `cidOrIpfsUri` | `string` | The CID or IPFS URI of the data to retrieve. |

##### Returns

`Promise`<`unknown`\>

A Promise that resolves to the retrieved data.

#### Defined in

[sdk/src/types/client.ts:93](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L93)

---

### getMetadata

• **getMetadata**: (`cidOrIpfsUri`: `string`) => `Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

#### Type declaration

▸ (`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

Retrieves the metadata for a Hypercert evaluation.

##### Parameters

| Name           | Type     | Description                                      |
| :------------- | :------- | :----------------------------------------------- |
| `cidOrIpfsUri` | `string` | The CID or IPFS URI of the metadata to retrieve. |

##### Returns

`Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

A Promise that resolves to the retrieved metadata.

#### Defined in

[sdk/src/types/client.ts:79](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L79)

---

### storeData

• **storeData**: (`data`: `unknown`) => `Promise`<`CIDString`\>

#### Type declaration

▸ (`data`): `Promise`<`CIDString`\>

Stores arbitrary data on IPFS.

##### Parameters

| Name   | Type      | Description        |
| :----- | :-------- | :----------------- |
| `data` | `unknown` | The data to store. |

##### Returns

`Promise`<`CIDString`\>

A Promise that resolves to the CID of the stored data.

#### Defined in

[sdk/src/types/client.ts:86](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L86)

---

### storeMetadata

• **storeMetadata**: (`metadata`: [`HypercertMetadata`](HypercertMetadata.md)) => `Promise`<`CIDString`\>

#### Type declaration

▸ (`metadata`): `Promise`<`CIDString`\>

Stores the metadata for a Hypercert evaluation.

##### Parameters

| Name       | Type                                        | Description            |
| :--------- | :------------------------------------------ | :--------------------- |
| `metadata` | [`HypercertMetadata`](HypercertMetadata.md) | The metadata to store. |

##### Returns

`Promise`<`CIDString`\>

A Promise that resolves to the CID of the stored metadata.

#### Defined in

[sdk/src/types/client.ts:72](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L72)
