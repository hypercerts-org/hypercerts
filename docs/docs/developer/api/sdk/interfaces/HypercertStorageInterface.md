---
id: "HypercertStorageInterface"
title: "Interface: HypercertStorageInterface"
sidebar_label: "HypercertStorageInterface"
sidebar_position: 0
custom_edit_url: null
---

The interface for the Hypercert storage layer.

## Implemented by

- [`HypercertsStorage`](../classes/HypercertsStorage.md)

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

[sdk/src/types/client.ts:98](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/types/client.ts#L98)

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

[sdk/src/types/client.ts:84](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/types/client.ts#L84)

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

[sdk/src/types/client.ts:91](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/types/client.ts#L91)

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

[sdk/src/types/client.ts:77](https://github.com/hypercerts-org/hypercerts/blob/210c167/sdk/src/types/client.ts#L77)
