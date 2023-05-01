[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / [types/client](../modules/types_client.md) /
HypercertStorageInterface

# Interface: HypercertStorageInterface

[types/client](../modules/types_client.md).HypercertStorageInterface

Hypercerts storage interface

**`Dev`**

getting and storing data handles unknown types and should be executed with care

**`Param`**

Store metadata on IPFS

**`Param`**

Get metadata from IPFS

**`Param`**

Store data on IPFS

**`Param`**

Get data from IPFS

## Implemented by

- [`default`](../classes/operator_hypercerts_storage.default.md)
- [`default`](../classes/storage.default.md)

## Table of contents

### Properties

- [getData](types_client.HypercertStorageInterface.md#getdata)
- [getMetadata](types_client.HypercertStorageInterface.md#getmetadata)
- [storeData](types_client.HypercertStorageInterface.md#storedata)
- [storeMetadata](types_client.HypercertStorageInterface.md#storemetadata)

## Properties

### getData

• **getData**: (`cidOrIpfsUri`: `string`) => `Promise`<`unknown`\>

#### Type declaration

▸ (`cidOrIpfsUri`): `Promise`<`unknown`\>

##### Parameters

| Name           | Type     |
| :------------- | :------- |
| `cidOrIpfsUri` | `string` |

##### Returns

`Promise`<`unknown`\>

#### Defined in

[sdk/src/types/client.ts:46](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L46)

---

### getMetadata

• **getMetadata**: (`cidOrIpfsUri`: `string`) => `Promise`<[`HypercertMetadata`](types_metadata.HypercertMetadata.md)\>

#### Type declaration

▸ (`cidOrIpfsUri`): `Promise`<[`HypercertMetadata`](types_metadata.HypercertMetadata.md)\>

##### Parameters

| Name           | Type     |
| :------------- | :------- |
| `cidOrIpfsUri` | `string` |

##### Returns

`Promise`<[`HypercertMetadata`](types_metadata.HypercertMetadata.md)\>

#### Defined in

[sdk/src/types/client.ts:44](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L44)

---

### storeData

• **storeData**: (`data`: `unknown`) => `Promise`<`CIDString`\>

#### Type declaration

▸ (`data`): `Promise`<`CIDString`\>

##### Parameters

| Name   | Type      |
| :----- | :-------- |
| `data` | `unknown` |

##### Returns

`Promise`<`CIDString`\>

#### Defined in

[sdk/src/types/client.ts:45](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L45)

---

### storeMetadata

• **storeMetadata**: (`metadata`: [`HypercertMetadata`](types_metadata.HypercertMetadata.md)) => `Promise`<`CIDString`\>

#### Type declaration

▸ (`metadata`): `Promise`<`CIDString`\>

##### Parameters

| Name       | Type                                                       |
| :--------- | :--------------------------------------------------------- |
| `metadata` | [`HypercertMetadata`](types_metadata.HypercertMetadata.md) |

##### Returns

`Promise`<`CIDString`\>

#### Defined in

[sdk/src/types/client.ts:43](https://github.com/Network-Goods/hypercerts/blob/29cf555/sdk/src/types/client.ts#L43)
