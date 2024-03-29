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

• **getData**: (`cidOrIpfsUri`: `string`, `config?`: [`StorageConfigOverrides`](../modules.md#storageconfigoverrides)) => `Promise`<`unknown`\>

#### Type declaration

▸ (`cidOrIpfsUri`, `config?`): `Promise`<`unknown`\>

Retrieves arbitrary data from IPFS.

##### Parameters

| Name           | Type                                                             | Description                                  |
| :------------- | :--------------------------------------------------------------- | :------------------------------------------- |
| `cidOrIpfsUri` | `string`                                                         | The CID or IPFS URI of the data to retrieve. |
| `config?`      | [`StorageConfigOverrides`](../modules.md#storageconfigoverrides) | An optional configuration object.            |

##### Returns

`Promise`<`unknown`\>

A Promise that resolves to the retrieved data.

#### Defined in

[sdk/src/types/client.ts:138](https://github.com/hypercerts-org/hypercerts/blob/ffe5811/sdk/src/types/client.ts#L138)

---

### getMetadata

• **getMetadata**: (`cidOrIpfsUri`: `string`, `config?`: [`StorageConfigOverrides`](../modules.md#storageconfigoverrides)) => `Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

#### Type declaration

▸ (`cidOrIpfsUri`, `config?`): `Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

Retrieves the metadata for a hypercerts.

##### Parameters

| Name           | Type                                                             | Description                                      |
| :------------- | :--------------------------------------------------------------- | :----------------------------------------------- |
| `cidOrIpfsUri` | `string`                                                         | The CID or IPFS URI of the metadata to retrieve. |
| `config?`      | [`StorageConfigOverrides`](../modules.md#storageconfigoverrides) | An optional configuration object.                |

##### Returns

`Promise`<[`HypercertMetadata`](HypercertMetadata.md)\>

A Promise that resolves to the retrieved metadata.

#### Defined in

[sdk/src/types/client.ts:130](https://github.com/hypercerts-org/hypercerts/blob/ffe5811/sdk/src/types/client.ts#L130)

---

### storeAllowList

• **storeAllowList**: (`allowList`: [`AllowlistEntry`](../modules.md#allowlistentry)[], `totalUnits`: `bigint`, `config?`: [`StorageConfigOverrides`](../modules.md#storageconfigoverrides)) => `Promise`<`string`\>

#### Type declaration

▸ (`allowList`, `totalUnits`, `config?`): `Promise`<`string`\>

Stores the allowlost for a hypercert.

##### Parameters

| Name         | Type                                                             | Description                       |
| :----------- | :--------------------------------------------------------------- | :-------------------------------- |
| `allowList`  | [`AllowlistEntry`](../modules.md#allowlistentry)[]               | The metadata to store.            |
| `totalUnits` | `bigint`                                                         | -                                 |
| `config?`    | [`StorageConfigOverrides`](../modules.md#storageconfigoverrides) | An optional configuration object. |

##### Returns

`Promise`<`string`\>

A Promise that resolves to the CID of the stored metadata.

#### Defined in

[sdk/src/types/client.ts:114](https://github.com/hypercerts-org/hypercerts/blob/ffe5811/sdk/src/types/client.ts#L114)

---

### storeMetadata

• **storeMetadata**: (`metadata`: [`HypercertMetadata`](HypercertMetadata.md), `config?`: [`StorageConfigOverrides`](../modules.md#storageconfigoverrides)) => `Promise`<`string`\>

#### Type declaration

▸ (`metadata`, `config?`): `Promise`<`string`\>

Stores the metadata for a hypercert.

##### Parameters

| Name       | Type                                                             | Description                       |
| :--------- | :--------------------------------------------------------------- | :-------------------------------- |
| `metadata` | [`HypercertMetadata`](HypercertMetadata.md)                      | The metadata to store.            |
| `config?`  | [`StorageConfigOverrides`](../modules.md#storageconfigoverrides) | An optional configuration object. |

##### Returns

`Promise`<`string`\>

A Promise that resolves to the CID of the stored metadata.

#### Defined in

[sdk/src/types/client.ts:122](https://github.com/hypercerts-org/hypercerts/blob/ffe5811/sdk/src/types/client.ts#L122)
