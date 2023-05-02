[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / types/client

# Module: types/client

## Table of contents

### Interfaces

- [HypercertClientInterface](../interfaces/types_client.HypercertClientInterface.md)
- [HypercertClientMethods](../interfaces/types_client.HypercertClientMethods.md)
- [HypercertStorageInterface](../interfaces/types_client.HypercertStorageInterface.md)

### Type Aliases

- [Deployment](types_client.md#deployment)
- [HypercertClientConfig](types_client.md#hypercertclientconfig)
- [HypercertClientProps](types_client.md#hypercertclientprops)
- [HypercertStorageProps](types_client.md#hypercertstorageprops)
- [SupportedChainIds](types_client.md#supportedchainids)

## Type Aliases

### Deployment

Ƭ **Deployment**: `Object`

#### Type declaration

| Name              | Type     |
| :---------------- | :------- |
| `chainId`         | `number` |
| `chainName`       | `string` |
| `contractAddress` | `string` |
| `graphName`       | `string` |

#### Defined in

[sdk/src/types/client.ts:11](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L11)

---

### HypercertClientConfig

Ƭ **HypercertClientConfig**: [`Deployment`](types_client.md#deployment) & { `provider?`: `ethers.providers.Provider` ; `rpcUrl?`: `string` ; `signer?`: `ethers.Signer` }

#### Defined in

[sdk/src/types/client.ts:18](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L18)

---

### HypercertClientProps

Ƭ **HypercertClientProps**: `Object`

Hypercerts client configuration

**`Param`**

Hypercerts client configuration

**`Param`**

Hypercerts storage configuration

#### Type declaration

| Name       | Type                                                                         |
| :--------- | :--------------------------------------------------------------------------- |
| `config?`  | `Partial`<[`HypercertClientConfig`](types_client.md#hypercertclientconfig)\> |
| `storage?` | [`default`](../classes/storage.default.md)                                   |

#### Defined in

[sdk/src/types/client.ts:54](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L54)

---

### HypercertStorageProps

Ƭ **HypercertStorageProps**: `Object`

Hypercerts storage configuration

**`Param`**

NFT Storage token

**`Param`**

Web3 Storage token

#### Type declaration

| Name                | Type     |
| :------------------ | :------- |
| `nftStorageToken?`  | `string` |
| `web3StorageToken?` | `string` |

#### Defined in

[sdk/src/types/client.ts:29](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L29)

---

### SupportedChainIds

Ƭ **SupportedChainIds**: `5` \| `10`

#### Defined in

[sdk/src/types/client.ts:9](https://github.com/Network-Goods/hypercerts/blob/4e6c302/sdk/src/types/client.ts#L9)
