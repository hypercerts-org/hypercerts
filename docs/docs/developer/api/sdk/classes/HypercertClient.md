[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertClient

# Class: HypercertClient

The `HypercertClient` is a core class in the hypercerts SDK, providing a high-level interface to interact with the hypercerts system.

It encapsulates the logic for storage, evaluation, indexing, and wallet interactions, abstracting the complexity and providing a simple API for users.
The client is read-only if the storage is read-only (no nft.storage/web3.storage keys) or if no walletClient was found.

The client can be configured using the `HypercertClientConfig` object. The `HypercertClientConfig` object can be passed to the constructor of the `HypercertClient` class.

**`Param`**

The configuration options for the client.
chain - Partial configuration for the blockchain network.
contractAddress - The address of the deployed contract.
graphUrl - The URL to the subgraph that indexes the contract events. Override for localized testing.
graphName - The name of the subgraph.
nftStorageToken - The API token for NFT.storage.
web3StorageToken - The API token for Web3.storage.
easContractAddress - The address of the EAS contract.
publicClient - The PublicClient is inherently read-only and is used for reading data from the blockchain.
walletClient - The WalletClient is used for signing and sending transactions.
unsafeForceOverrideConfig - Boolean to force the use of overridden values.
readOnly - Boolean to assert if the client is in read-only mode.
readOnlyReason - Reason for read-only mode. This is optional and can be used for logging or debugging purposes.

**`{chain: { id: <chainId>}}` is the only required field.**

**`Throws`**

Will throw a `ClientError` if the public client cannot be found.

**`Example`**

```ts
import HypercertClient from '@hypercert.org/sdk';

const client = new HypercertClient({ chain: {id: 5} });

const metaData = {...}

const totalUnits = 1n;
const transferRestriction = TransferRestrictions.FromCreatorOnly;

const txHash = await client.mintClaim(metaData, totalUnits, transferRestriction);
```

## Implements

- [`HypercertClientInterface`](../interfaces/HypercertClientInterface.md)

## Table of contents

### Constructors

- [constructor](HypercertClient.md#constructor)

### Properties

- [\_config](HypercertClient.md#_config)
- [\_evaluator](HypercertClient.md#_evaluator)
- [\_indexer](HypercertClient.md#_indexer)
- [\_publicClient](HypercertClient.md#_publicclient)
- [\_storage](HypercertClient.md#_storage)
- [\_walletClient](HypercertClient.md#_walletclient)
- [readonly](HypercertClient.md#readonly)

### Accessors

- [config](HypercertClient.md#config)
- [contract](HypercertClient.md#contract)
- [indexer](HypercertClient.md#indexer)
- [storage](HypercertClient.md#storage)

### Methods

- [batchMintClaimFractionsFromAllowlists](HypercertClient.md#batchmintclaimfractionsfromallowlists)
- [burnClaimFraction](HypercertClient.md#burnclaimfraction)
- [createAllowlist](HypercertClient.md#createallowlist)
- [getCleanedOverrides](HypercertClient.md#getcleanedoverrides)
- [getContractConfig](HypercertClient.md#getcontractconfig)
- [getWallet](HypercertClient.md#getwallet)
- [mergeFractionUnits](HypercertClient.md#mergefractionunits)
- [mintClaim](HypercertClient.md#mintclaim)
- [mintClaimFractionFromAllowlist](HypercertClient.md#mintclaimfractionfromallowlist)
- [splitFractionUnits](HypercertClient.md#splitfractionunits)
- [submitRequest](HypercertClient.md#submitrequest)

## Constructors

### constructor

• **new HypercertClient**(`config`): [`HypercertClient`](HypercertClient.md)

Creates a new instance of the `HypercertClient` class.

This constructor takes a `config` parameter that is used to configure the client. The `config` parameter should be a `HypercertClientConfig` object. If the public client cannot be connected, it throws a `ClientError`.

#### Parameters

| Name     | Type                                                                        | Description                               |
| :------- | :-------------------------------------------------------------------------- | :---------------------------------------- |
| `config` | `Partial`\<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\> | The configuration options for the client. |

#### Returns

[`HypercertClient`](HypercertClient.md)

**`Throws`**

Will throw a `ClientError` if the public client cannot be connected.

#### Defined in

sdk/src/client.ts:81

## Properties

### \_config

• `Readonly` **\_config**: `Partial`\<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\>

#### Defined in

sdk/src/client.ts:64

---

### \_evaluator

• `Private` `Optional` **\_evaluator**: [`default`](internal.default.md)

#### Defined in

sdk/src/client.ts:67

---

### \_indexer

• `Private` **\_indexer**: [`default`](internal.default-1.md)

#### Defined in

sdk/src/client.ts:68

---

### \_publicClient

• `Private` **\_publicClient**: `Object`

#### Defined in

sdk/src/client.ts:69

---

### \_storage

• `Private` **\_storage**: [`HypercertsStorage`](HypercertsStorage.md)

#### Defined in

sdk/src/client.ts:65

---

### \_walletClient

• `Private` `Optional` **\_walletClient**: `Object`

#### Defined in

sdk/src/client.ts:70

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[readonly](../interfaces/HypercertClientInterface.md#readonly)

#### Defined in

sdk/src/client.ts:71

## Accessors

### config

• `get` **config**(): `Partial`\<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\>

Gets the config for the client.

#### Returns

`Partial`\<[`HypercertClientConfig`](../modules.md#hypercertclientconfig)\>

The client config.

#### Defined in

sdk/src/client.ts:105

---

### contract

• `get` **contract**(): `GetContractReturnType`

Gets the HypercertMinter contract used by the client.

#### Returns

`GetContractReturnType`

The contract.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[contract](../interfaces/HypercertClientInterface.md#contract)

#### Defined in

sdk/src/client.ts:129

---

### indexer

• `get` **indexer**(): [`default`](internal.default-1.md)

Gets the indexer for the client.

#### Returns

[`default`](internal.default-1.md)

The indexer.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[indexer](../interfaces/HypercertClientInterface.md#indexer)

#### Defined in

sdk/src/client.ts:121

---

### storage

• `get` **storage**(): [`HypercertsStorage`](HypercertsStorage.md)

Gets the storage layer for the client.

#### Returns

[`HypercertsStorage`](HypercertsStorage.md)

The storage layer.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[storage](../interfaces/HypercertClientInterface.md#storage)

#### Defined in

sdk/src/client.ts:113

## Methods

### batchMintClaimFractionsFromAllowlists

▸ **batchMintClaimFractionsFromAllowlists**(`claimIds`, `units`, `proofs`, `roots?`, `overrides?`): `Promise`\<\`0x$\{string}\`\>

Mints multiple claim fractions from allowlists in a batch.

This method first retrieves the wallet client and account using the `getWallet` method. If the roots are provided, it verifies each proof using the `verifyMerkleProofs` function. If any of the proofs are invalid, it throws an `InvalidOrMissingError`.
It then simulates a contract call to the `batchMintClaimsFromAllowlists` function with the provided parameters and the account, and submits the request using the `submitRequest` method.

#### Parameters

| Name         | Type                                                     | Description                                                               |
| :----------- | :------------------------------------------------------- | :------------------------------------------------------------------------ |
| `claimIds`   | `bigint`[]                                               | The IDs of the claims to mint.                                            |
| `units`      | `bigint`[]                                               | The units of each claim to mint.                                          |
| `proofs`     | (\`0x$\{string}\` \| `Uint8Array`)[][]                   | The proofs for each claim.                                                |
| `roots?`     | (\`0x$\{string}\` \| `Uint8Array`)[]                     | The roots of each proof. If provided, they are used to verify the proofs. |
| `overrides?` | [`SupportedOverrides`](../modules.md#supportedoverrides) | Optional overrides for the contract call.                                 |

#### Returns

`Promise`\<\`0x$\{string}\`\>

A promise that resolves to the transaction hash.

**`Throws`**

Will throw an `InvalidOrMissingError` if any of the proofs are invalid.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[batchMintClaimFractionsFromAllowlists](../interfaces/HypercertClientInterface.md#batchmintclaimfractionsfromallowlists)

#### Defined in

sdk/src/client.ts:435

---

### burnClaimFraction

▸ **burnClaimFraction**(`claimId`, `overrides?`): `Promise`\<\`0x$\{string}\`\>

Burns a claim fraction.

This method first retrieves the wallet client and account using the `getWallet` method. It then retrieves the owner of the claim using the `ownerOf` method of the read contract.
If the claim is not owned by the account, it throws a `ClientError`.
It then simulates a contract call to the `burnFraction` function with the provided parameters and the account, and submits the request using the `submitRequest` method.

#### Parameters

| Name         | Type                                                     | Description                               |
| :----------- | :------------------------------------------------------- | :---------------------------------------- |
| `claimId`    | `bigint`                                                 | The ID of the claim to burn.              |
| `overrides?` | [`SupportedOverrides`](../modules.md#supportedoverrides) | Optional overrides for the contract call. |

#### Returns

`Promise`\<\`0x$\{string}\`\>

A promise that resolves to the transaction hash.

**`Throws`**

Will throw a `ClientError` if the claim is not owned by the account.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[burnClaimFraction](../interfaces/HypercertClientInterface.md#burnclaimfraction)

#### Defined in

sdk/src/client.ts:351

---

### createAllowlist

▸ **createAllowlist**(`allowList`, `metaData`, `totalUnits`, `transferRestriction`, `overrides?`): `Promise`\<\`0x$\{string}\`\>

Creates an allowlist.

This method first validates the provided allowlist and metadata using the `validateAllowlist` and `validateMetaData` functions respectively. If either is invalid, it throws a `MalformedDataError`.
It then creates an allowlist from the provided entries and stores it on IPFS using the `storeData` method of the storage client.
After that, it stores the metadata (including the CID of the allowlist) on IPFS using the `storeMetadata` method of the storage client.
Finally, it simulates a contract call to the `createAllowlist` function with the provided parameters and the stored metadata CID, and submits the request using the `submitRequest` method.

#### Parameters

| Name                  | Type                                                           | Description                               |
| :-------------------- | :------------------------------------------------------------- | :---------------------------------------- |
| `allowList`           | [`AllowlistEntry`](../modules.md#allowlistentry)[]             | The entries for the allowlist.            |
| `metaData`            | [`HypercertMetadata`](../interfaces/HypercertMetadata.md)      | The metadata for the claim.               |
| `totalUnits`          | `bigint`                                                       | The total units for the claim.            |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restrictions for the claim.  |
| `overrides?`          | [`SupportedOverrides`](../modules.md#supportedoverrides)       | Optional overrides for the contract call. |

#### Returns

`Promise`\<\`0x$\{string}\`\>

A promise that resolves to the transaction hash.

**`Throws`**

Will throw a `MalformedDataError` if the provided allowlist or metadata is invalid.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[createAllowlist](../interfaces/HypercertClientInterface.md#createallowlist)

#### Defined in

sdk/src/client.ts:207

---

### getCleanedOverrides

▸ **getCleanedOverrides**(`overrides?`): `Object`

#### Parameters

| Name         | Type                                                     |
| :----------- | :------------------------------------------------------- |
| `overrides?` | [`SupportedOverrides`](../modules.md#supportedoverrides) |

#### Returns

`Object`

#### Defined in

sdk/src/client.ts:476

---

### getContractConfig

▸ **getContractConfig**(): `GetContractReturnType`\<`Abi`, `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`\>, `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`\>, \`0x$\{string}\`, `string`, `string`, `string`, `false`\>

#### Returns

`GetContractReturnType`\<`Abi`, `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`\>, `undefined` \| `Client`\<`Transport`, `undefined` \| `Chain`, `undefined` \| `Account`\>, \`0x$\{string}\`, `string`, `string`, `string`, `false`\>

#### Defined in

sdk/src/client.ts:467

---

### getWallet

▸ **getWallet**(): `Object`

#### Returns

`Object`

| Name           | Type                     |
| :------------- | :----------------------- |
| `account`      | `undefined` \| `Account` |
| `walletClient` | {}                       |

#### Defined in

sdk/src/client.ts:486

---

### mergeFractionUnits

▸ **mergeFractionUnits**(`fractionIds`, `overrides?`): `Promise`\<\`0x$\{string}\`\>

Merges multiple fractions into a single fraction.

This method first retrieves the wallet client and account using the `getWallet` method. It then retrieves the owner of each fraction using the `ownerOf` method of the read contract.
If any of the fractions are not owned by the account, it throws a `ClientError`.
It then simulates a contract call to the `mergeFractions` function with the provided parameters and the account, and submits the request using the `submitRequest` method.

#### Parameters

| Name          | Type                                                     | Description                               |
| :------------ | :------------------------------------------------------- | :---------------------------------------- |
| `fractionIds` | `bigint`[]                                               | The IDs of the fractions to merge.        |
| `overrides?`  | [`SupportedOverrides`](../modules.md#supportedoverrides) | Optional overrides for the contract call. |

#### Returns

`Promise`\<\`0x$\{string}\`\>

A promise that resolves to the transaction hash.

**`Throws`**

Will throw a `ClientError` if any of the fractions are not owned by the account.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[mergeFractionUnits](../interfaces/HypercertClientInterface.md#mergefractionunits)

#### Defined in

sdk/src/client.ts:307

---

### mintClaim

▸ **mintClaim**(`metaData`, `totalUnits`, `transferRestriction`, `overrides?`): `Promise`\<\`0x$\{string}\`\>

Mints a new claim.

This method first validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`.
It then stores the metadata on IPFS using the `storeMetadata` method of the storage client.
After that, it simulates a contract call to the `mintClaim` function with the provided parameters and the stored metadata CID to validate the transaction.
Finally, it submits the request using the `submitRequest` method.

#### Parameters

| Name                  | Type                                                           | Description                               |
| :-------------------- | :------------------------------------------------------------- | :---------------------------------------- |
| `metaData`            | [`HypercertMetadata`](../interfaces/HypercertMetadata.md)      | The metadata for the claim.               |
| `totalUnits`          | `bigint`                                                       | The total units for the claim.            |
| `transferRestriction` | [`TransferRestrictions`](../modules.md#transferrestrictions-1) | The transfer restrictions for the claim.  |
| `overrides?`          | [`SupportedOverrides`](../modules.md#supportedoverrides)       | Optional overrides for the contract call. |

#### Returns

`Promise`\<\`0x$\{string}\`\>

A promise that resolves to the transaction hash.

**`Throws`**

Will throw a `MalformedDataError` if the provided metadata is invalid.

**`Example`**

```
const metaData = {...}

const totalUnits = 1n;
const transferRestriction = TransferRestrictions.FromCreatorOnly;

const txHash = await client.mintClaim(metaData, totalUnits, transferRestriction);
```

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[mintClaim](../interfaces/HypercertClientInterface.md#mintclaim)

#### Defined in

sdk/src/client.ts:163

---

### mintClaimFractionFromAllowlist

▸ **mintClaimFractionFromAllowlist**(`claimId`, `units`, `proof`, `root?`, `overrides?`): `Promise`\<\`0x$\{string}\`\>

Mints a claim fraction from an allowlist.

This method first retrieves the wallet client and account using the `getWallet` method. It then verifies the provided proof using the `verifyMerkleProof` function. If the proof is invalid, it throws an `InvalidOrMissingError`.
It then simulates a contract call to the `mintClaimFromAllowlist` function with the provided parameters and the account, and submits the request using the `submitRequest` method.

#### Parameters

| Name         | Type                                                     | Description                                                         |
| :----------- | :------------------------------------------------------- | :------------------------------------------------------------------ |
| `claimId`    | `bigint`                                                 | The ID of the claim to mint.                                        |
| `units`      | `bigint`                                                 | The units of the claim to mint.                                     |
| `proof`      | (\`0x$\{string}\` \| `Uint8Array`)[]                     | The proof for the claim.                                            |
| `root?`      | \`0x$\{string}\` \| `Uint8Array`                         | The root of the proof. If provided, it is used to verify the proof. |
| `overrides?` | [`SupportedOverrides`](../modules.md#supportedoverrides) | Optional overrides for the contract call.                           |

#### Returns

`Promise`\<\`0x$\{string}\`\>

A promise that resolves to the transaction hash.

**`Throws`**

Will throw an `InvalidOrMissingError` if the proof is invalid.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[mintClaimFractionFromAllowlist](../interfaces/HypercertClientInterface.md#mintclaimfractionfromallowlist)

#### Defined in

sdk/src/client.ts:390

---

### splitFractionUnits

▸ **splitFractionUnits**(`fractionId`, `fractions`, `overrides?`): `Promise`\<\`0x$\{string}\`\>

Splits a fraction into multiple fractions.

This method first retrieves the wallet client and account using the `getWallet` method. It then retrieves the owner and total units of the fraction using the `ownerOf` and `unitsOf` methods of the read contract.
If the fraction is not owned by the account, it throws a `ClientError`.
It then checks if the sum of the provided fractions is equal to the total units of the fraction. If not, it throws a `ClientError`.
Finally, it simulates a contract call to the `splitFraction` function with the provided parameters and the account, and submits the request using the `submitRequest` method.

#### Parameters

| Name         | Type                                                     | Description                               |
| :----------- | :------------------------------------------------------- | :---------------------------------------- |
| `fractionId` | `bigint`                                                 | The ID of the fraction to split.          |
| `fractions`  | `bigint`[]                                               | The fractions to split the fraction into. |
| `overrides?` | [`SupportedOverrides`](../modules.md#supportedoverrides) | Optional overrides for the contract call. |

#### Returns

`Promise`\<\`0x$\{string}\`\>

A promise that resolves to the transaction hash.

**`Throws`**

Will throw a `ClientError` if the fraction is not owned by the account or if the sum of the fractions is not equal to the total units of the fraction.

#### Implementation of

[HypercertClientInterface](../interfaces/HypercertClientInterface.md).[splitFractionUnits](../interfaces/HypercertClientInterface.md#splitfractionunits)

#### Defined in

sdk/src/client.ts:261

---

### submitRequest

▸ **submitRequest**(`request`): `Promise`\<\`0x$\{string}\`\>

Submits a contract request.

This method submits a contract request using the `writeContract` method of the wallet client. If the request fails, it throws a `ClientError`.

#### Parameters

| Name      | Type  | Description                     |
| :-------- | :---- | :------------------------------ |
| `request` | `any` | The contract request to submit. |

#### Returns

`Promise`\<\`0x$\{string}\`\>

A promise that resolves to the hash of the submitted request.

**`Throws`**

Will throw a `ClientError` if the request fails.

#### Defined in

sdk/src/client.ts:505
