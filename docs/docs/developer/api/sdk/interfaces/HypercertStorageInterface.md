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

[sdk/src/types/client.ts:110](https://github.com/hypercerts-org/hypercerts/blob/e194fdd/sdk/src/types/client.ts#L110)

---

### getMetadata

• **getMetadata**: (`cidOrIpfsUri`: `string`) => `Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

#### Type declaration

▸ (`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

Retrieves the metadata for a hypercerts.

##### Parameters

| Name           | Type     | Description                                      |
| :------------- | :------- | :----------------------------------------------- |
| `cidOrIpfsUri` | `string` | The CID or IPFS URI of the metadata to retrieve. |

##### Returns

`Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

A Promise that resolves to the retrieved metadata.

#### Defined in

[sdk/src/types/client.ts:103](https://github.com/hypercerts-org/hypercerts/blob/e194fdd/sdk/src/types/client.ts#L103)

---

### storeAllowList

• **storeAllowList**: (`allowList`: [`AllowlistEntry`](../modules.md#allowlistentry)[], `totalUnits`: `bigint`) => `Promise`<`string`\>

#### Type declaration

▸ (`allowList`, `totalUnits`): `Promise`<`string`\>

Stores the allowlost for a hypercert.

##### Parameters

| Name         | Type                                               | Description            |
| :----------- | :------------------------------------------------- | :--------------------- |
| `allowList`  | [`AllowlistEntry`](../modules.md#allowlistentry)[] | The metadata to store. |
| `totalUnits` | `bigint`                                           | -                      |

##### Returns

`Promise`<`string`\>

A Promise that resolves to the CID of the stored metadata.

#### Defined in

[sdk/src/types/client.ts:89](https://github.com/hypercerts-org/hypercerts/blob/e194fdd/sdk/src/types/client.ts#L89)

---

### storeMetadata

• **storeMetadata**: (`metadata`: [`HypercertMetadata`](HypercertMetadata.md)) => `Promise`<`string`\>

#### Type declaration

▸ (`metadata`): `Promise`<`string`\>

Stores the metadata for a hypercert.

##### Parameters

| Name       | Type                                        | Description            |
| :--------- | :------------------------------------------ | :--------------------- |
| `metadata` | [`HypercertMetadata`](HypercertMetadata.md) | The metadata to store. |

##### Returns

`Promise`<`string`\>

A Promise that resolves to the CID of the stored metadata.

#### Defined in

[sdk/src/types/client.ts:96](https://github.com/hypercerts-org/hypercerts/blob/e194fdd/sdk/src/types/client.ts#L96)
