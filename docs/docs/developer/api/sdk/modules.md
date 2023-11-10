[Hypercerts SDK Documentation](README.md) / Exports

# Hypercerts SDK Documentation

## Table of contents

### Modules

- [internal](modules/internal.md)

### Classes

- [ClientError](classes/ClientError.md)
- [ConfigurationError](classes/ConfigurationError.md)
- [FetchError](classes/FetchError.md)
- [HypercertClient](classes/HypercertClient.md)
- [HypercertsStorage](classes/HypercertsStorage.md)
- [InvalidOrMissingError](classes/InvalidOrMissingError.md)
- [MalformedDataError](classes/MalformedDataError.md)
- [MintingError](classes/MintingError.md)
- [StorageError](classes/StorageError.md)
- [UnknownSchemaError](classes/UnknownSchemaError.md)
- [UnsupportedChainError](classes/UnsupportedChainError.md)

### Interfaces

- [CustomError](interfaces/CustomError.md)
- [DuplicateEvaluation](interfaces/DuplicateEvaluation.md)
- [EASEvaluation](interfaces/EASEvaluation.md)
- [HypercertClaimdata](interfaces/HypercertClaimdata.md)
- [HypercertClientInterface](interfaces/HypercertClientInterface.md)
- [HypercertClientMethods](interfaces/HypercertClientMethods.md)
- [HypercertClientState](interfaces/HypercertClientState.md)
- [HypercertEvaluationSchema](interfaces/HypercertEvaluationSchema.md)
- [HypercertIndexerInterface](interfaces/HypercertIndexerInterface.md)
- [HypercertMetadata](interfaces/HypercertMetadata.md)
- [HypercertPointer](interfaces/HypercertPointer.md)
- [HypercertStorageInterface](interfaces/HypercertStorageInterface.md)
- [IPFSEvaluation](interfaces/IPFSEvaluation.md)
- [SimpleTextEvaluation](interfaces/SimpleTextEvaluation.md)

### Type Aliases

- [AllowlistEntry](modules.md#allowlistentry)
- [Claim](modules.md#claim)
- [ClaimByIdQuery](modules.md#claimbyidquery)
- [ClaimToken](modules.md#claimtoken)
- [ClaimTokensByClaimQuery](modules.md#claimtokensbyclaimquery)
- [Deployment](modules.md#deployment)
- [EvaluationData](modules.md#evaluationdata)
- [EvaluationSource](modules.md#evaluationsource)
- [HypercertClientConfig](modules.md#hypercertclientconfig)
- [HypercertClientProps](modules.md#hypercertclientprops)
- [HypercertEvaluatorConfig](modules.md#hypercertevaluatorconfig)
- [HypercertStorageConfig](modules.md#hypercertstorageconfig)
- [HypercertsSdkError](modules.md#hypercertssdkerror)
- [QueryParams](modules.md#queryparams)
- [SupportedChainIds](modules.md#supportedchainids)
- [SupportedOverrides](modules.md#supportedoverrides)
- [TransferRestrictions](modules.md#transferrestrictions)

### Variables

- [TransferRestrictions](modules.md#transferrestrictions-1)
- [allowlist](modules.md#allowlist)
- [deployments](modules.md#deployments)
- [fetchers](modules.md#fetchers)

### Functions

- [execute](modules.md#execute)
- [formatHypercertData](modules.md#formathypercertdata)
- [publicClientToProvider](modules.md#publicclienttoprovider)
- [validateAllowlist](modules.md#validateallowlist)
- [validateClaimData](modules.md#validateclaimdata)
- [validateDuplicateEvaluationData](modules.md#validateduplicateevaluationdata)
- [validateMetaData](modules.md#validatemetadata)
- [validateSimpleTextEvaluationData](modules.md#validatesimpletextevaluationdata)
- [verifyMerkleProof](modules.md#verifymerkleproof)
- [verifyMerkleProofs](modules.md#verifymerkleproofs)
- [walletClientToSigner](modules.md#walletclienttosigner)

## Type Aliases

### AllowlistEntry

Ƭ **AllowlistEntry**: `Object`

Represents an entry in an allowlist.

#### Type declaration

| Name      | Type     |
| :-------- | :------- |
| `address` | `string` |
| `units`   | `bigint` |

#### Defined in

sdk/src/types/hypercerts.ts:24

---

### Claim

Ƭ **Claim**: `Object`

#### Type declaration

| Name          | Type                                                                                           |
| :------------ | :--------------------------------------------------------------------------------------------- |
| `allowlist?`  | [`Maybe`](modules/internal.md#maybe)\<[`Allowlist`](modules/internal.md#allowlist)\>           |
| `contract`    | [`Scalars`](modules/internal.md#scalars)[``"String"``]                                         |
| `creation`    | [`Scalars`](modules/internal.md#scalars)[``"BigInt"``]                                         |
| `creator?`    | [`Maybe`](modules/internal.md#maybe)\<[`Scalars`](modules/internal.md#scalars)[``"Bytes"``]\>  |
| `graphName`   | [`Scalars`](modules/internal.md#scalars)[``"String"``]                                         |
| `id`          | [`Scalars`](modules/internal.md#scalars)[``"String"``]                                         |
| `owner?`      | [`Maybe`](modules/internal.md#maybe)\<[`Scalars`](modules/internal.md#scalars)[``"Bytes"``]\>  |
| `tokenID`     | [`Scalars`](modules/internal.md#scalars)[``"BigInt"``]                                         |
| `totalUnits?` | [`Maybe`](modules/internal.md#maybe)\<[`Scalars`](modules/internal.md#scalars)[``"BigInt"``]\> |
| `uri?`        | [`Maybe`](modules/internal.md#maybe)\<[`Scalars`](modules/internal.md#scalars)[``"String"``]\> |

#### Defined in

sdk/.graphclient/index.ts:513

---

### ClaimByIdQuery

Ƭ **ClaimByIdQuery**: `Object`

#### Type declaration

| Name     | Type                                                                                                                                                                                           |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `claim?` | [`Maybe`](modules/internal.md#maybe)\<`Pick`\<[`Claim`](modules.md#claim), `"graphName"` \| `"contract"` \| `"tokenID"` \| `"creator"` \| `"id"` \| `"owner"` \| `"totalUnits"` \| `"uri"`\>\> |

#### Defined in

sdk/.graphclient/index.ts:1670

---

### ClaimToken

Ƭ **ClaimToken**: `Object`

#### Type declaration

| Name        | Type                                                                           |
| :---------- | :----------------------------------------------------------------------------- |
| `claim`     | [`Claim`](modules.md#claim)                                                    |
| `graphName` | [`Scalars`](modules/internal.md#scalars)[``"String"``]                         |
| `id`        | [`Scalars`](modules/internal.md#scalars)[``"String"``]                         |
| `offers?`   | [`Maybe`](modules/internal.md#maybe)\<[`Offer`](modules/internal.md#offer)[]\> |
| `owner`     | [`Scalars`](modules/internal.md#scalars)[``"Bytes"``]                          |
| `tokenID`   | [`Scalars`](modules/internal.md#scalars)[``"BigInt"``]                         |
| `units`     | [`Scalars`](modules/internal.md#scalars)[``"BigInt"``]                         |

#### Defined in

sdk/.graphclient/index.ts:526

---

### ClaimTokensByClaimQuery

Ƭ **ClaimTokensByClaimQuery**: `Object`

#### Type declaration

| Name          | Type                                                                                                                |
| :------------ | :------------------------------------------------------------------------------------------------------------------ |
| `claimTokens` | `Pick`\<[`ClaimToken`](modules.md#claimtoken), `"graphName"` \| `"id"` \| `"owner"` \| `"tokenID"` \| `"units"`\>[] |

#### Defined in

sdk/.graphclient/index.ts:1693

---

### Deployment

Ƭ **Deployment**: `Object`

Configuration object for the Deployment.

#### Type declaration

| Name              | Type                 | Description                                                                              |
| :---------------- | :------------------- | :--------------------------------------------------------------------------------------- |
| `chain`           | `Partial`\<`Chain`\> | -                                                                                        |
| `contractAddress` | `string`             | The address of the deployed contract.                                                    |
| `graphName`       | `string`             | -                                                                                        |
| `graphUrl`        | `string`             | The url to the subgraph that indexes the contract events. Override for localized testing |

#### Defined in

sdk/src/types/client.ts:27

---

### EvaluationData

Ƭ **EvaluationData**: [`DuplicateEvaluation`](interfaces/DuplicateEvaluation.md) \| [`SimpleTextEvaluation`](interfaces/SimpleTextEvaluation.md)

This file was automatically generated by json-schema-to-typescript.
DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
and run json-schema-to-typescript to regenerate this file.

#### Defined in

sdk/src/types/evaluation.d.ts:8

---

### EvaluationSource

Ƭ **EvaluationSource**: [`EASEvaluation`](interfaces/EASEvaluation.md) \| [`IPFSEvaluation`](interfaces/IPFSEvaluation.md)

#### Defined in

sdk/src/types/evaluation.d.ts:9

---

### HypercertClientConfig

Ƭ **HypercertClientConfig**: [`Deployment`](modules.md#deployment) & [`HypercertStorageConfig`](modules.md#hypercertstorageconfig) & [`HypercertEvaluatorConfig`](modules.md#hypercertevaluatorconfig) & \{ `publicClient`: `PublicClient` ; `readOnly`: `boolean` ; `readOnlyReason?`: `string` ; `unsafeForceOverrideConfig?`: `boolean` ; `walletClient`: `WalletClient` }

Configuration options for the Hypercert client.

#### Defined in

sdk/src/types/client.ts:39

---

### HypercertClientProps

Ƭ **HypercertClientProps**: `Object`

The props for the Hypercert client.

#### Type declaration

| Name      | Type                                                                     | Description                                         |
| :-------- | :----------------------------------------------------------------------- | :-------------------------------------------------- |
| `config?` | `Partial`\<[`HypercertClientConfig`](modules.md#hypercertclientconfig)\> | The configuration options for the Hypercert client. |

#### Defined in

sdk/src/types/client.ts:112

---

### HypercertEvaluatorConfig

Ƭ **HypercertEvaluatorConfig**: `Omit`\<`PartialTypedDataConfig`, `"address"`\> & \{ `easContractAddress`: `string` }

Configuration object for the HypercertEvaluator.

#### Defined in

sdk/src/types/client.ts:72

---

### HypercertStorageConfig

Ƭ **HypercertStorageConfig**: `Object`

Configuration object for the HypercertStorage.

**`Remark`**

The API tokens are optional, but required for storing data on NFT.storage and Web3.storage.

#### Type declaration

| Name                | Type     | Description                     |
| :------------------ | :------- | :------------------------------ |
| `nftStorageToken?`  | `string` | The API token for NFT.storage.  |
| `web3StorageToken?` | `string` | The API token for Web3.storage. |

#### Defined in

sdk/src/types/client.ts:60

---

### HypercertsSdkError

Ƭ **HypercertsSdkError**: [`ConfigurationError`](classes/ConfigurationError.md) \| [`FetchError`](classes/FetchError.md) \| [`InvalidOrMissingError`](classes/InvalidOrMissingError.md) \| [`MalformedDataError`](classes/MalformedDataError.md) \| [`MintingError`](classes/MintingError.md) \| [`StorageError`](classes/StorageError.md) \| [`UnsupportedChainError`](classes/UnsupportedChainError.md) \| [`UnknownSchemaError`](classes/UnknownSchemaError.md)

#### Defined in

sdk/src/types/errors.ts:173

---

### QueryParams

Ƭ **QueryParams**: `Object`

#### Index signature

▪ [key: `string`]: `string` \| `number` \| `undefined`

#### Type declaration

| Name              | Type                |
| :---------------- | :------------------ |
| `first`           | `number`            |
| `orderDirections` | `"asc"` \| `"desc"` |
| `skip`            | `number`            |

#### Defined in

sdk/src/types/indexer.ts:11

---

### SupportedChainIds

Ƭ **SupportedChainIds**: `5` \| `10` \| `42220` \| `11155111`

#### Defined in

sdk/src/types/client.ts:12

---

### SupportedOverrides

Ƭ **SupportedOverrides**: `Object`

#### Type declaration

| Name        | Type     |
| :---------- | :------- |
| `gasLimit?` | `bigint` |
| `gasPrice?` | `bigint` |
| `value?`    | `bigint` |

#### Defined in

sdk/src/types/client.ts:13

---

### TransferRestrictions

Ƭ **TransferRestrictions**: typeof [`TransferRestrictions`](modules.md#transferrestrictions-1)[keyof typeof [`TransferRestrictions`](modules.md#transferrestrictions-1)]

#### Defined in

sdk/src/types/hypercerts.ts:9

sdk/src/types/hypercerts.ts:15

## Variables

### TransferRestrictions

• `Const` **TransferRestrictions**: `Object`

Represents the possible transfer restrictions of a claim matching the hypercerts protocol.

#### Type declaration

| Name              | Type |
| :---------------- | :--- |
| `AllowAll`        | `0`  |
| `DisallowAll`     | `1`  |
| `FromCreatorOnly` | `2`  |

#### Defined in

sdk/src/types/hypercerts.ts:9

sdk/src/types/hypercerts.ts:15

---

### allowlist

• **allowlist**: `Object`

#### Type declaration

| Name                     | Type                                                                                                                                           |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `getProofsFromAllowlist` | (`cidOrIpfsUri`: `string`, `account`: \`0x$\{string}\`) => `Promise`\<`undefined` \| \{ `proof`: `string`[] ; `root`: `string` = tree.root }\> |

#### Defined in

sdk/src/utils/allowlist.ts:46

---

### deployments

• `Const` **deployments**: \{ [key in SupportedChainIds]: Partial\<Deployment\> }

#### Defined in

sdk/src/constants.ts:10

---

### fetchers

• **fetchers**: `Object`

#### Type declaration

| Name          | Type                                                                       |
| :------------ | :------------------------------------------------------------------------- |
| `getFromIPFS` | (`cidOrIpfsUri`: `string`, `timeout?`: `number`) => `Promise`\<`unknown`\> |

#### Defined in

sdk/src/utils/fetchers.ts:47

## Functions

### execute

▸ **execute**(`document`, `variables`, `context?`, `rootValue?`, `operationName?`): `Promise`\<`ExecutionResult`\<`any`, `ObjMap`\<`unknown`\>\>\>

#### Parameters

| Name             | Type                               |
| :--------------- | :--------------------------------- |
| `document`       | `GraphQLOperation`\<`any`, `any`\> |
| `variables`      | `any`                              |
| `context?`       | `any`                              |
| `rootValue?`     | `any`                              |
| `operationName?` | `string`                           |

#### Returns

`Promise`\<`ExecutionResult`\<`any`, `ObjMap`\<`unknown`\>\>\>

#### Defined in

node*modules/.pnpm/@graphql-mesh+runtime@0.96.13*@graphql-mesh+cross-helpers@0.4.1_@graphql-mesh+types@0.95.8_@g_5es4c5k7lxx7xcrrx5jxmoagam/node_modules/@graphql-mesh/runtime/typings/types.d.cts:25

---

### formatHypercertData

▸ **formatHypercertData**(`«destructured»`): [`FormatResult`](modules/internal.md#formatresult)

Formats input data to an object containing HypercertMetadata including appropriate labels

#### Parameters

| Name                     | Type                                              |
| :----------------------- | :------------------------------------------------ |
| `«destructured»`         | `Object`                                          |
| › `contributors`         | `string`[]                                        |
| › `description`          | `string`                                          |
| › `excludedImpactScope`  | `string`[]                                        |
| › `excludedRights`       | `string`[]                                        |
| › `excludedWorkScope`    | `string`[]                                        |
| › `external_url?`        | `string`                                          |
| › `image`                | `string`                                          |
| › `impactScope`          | `string`[]                                        |
| › `impactTimeframeEnd`   | `number`                                          |
| › `impactTimeframeStart` | `number`                                          |
| › `name`                 | `string`                                          |
| › `properties?`          | \{ `trait_type`: `string` ; `value`: `string` }[] |
| › `rights`               | `string`[]                                        |
| › `version`              | `string`                                          |
| › `workScope`            | `string`[]                                        |
| › `workTimeframeEnd`     | `number`                                          |
| › `workTimeframeStart`   | `number`                                          |

#### Returns

[`FormatResult`](modules/internal.md#formatresult)

#### Defined in

sdk/src/utils/formatter.ts:27

---

### publicClientToProvider

▸ **publicClientToProvider**(`publicClient`): `undefined` \| `FallbackProvider` \| `JsonRpcProvider`

This function converts a `PublicClient` instance to an ethers.js `Provider` to faciliate compatibility between ethers and viem.

It extracts the chain and transport from the `PublicClient` and creates a network object.
If no chain is found in the `PublicClient`, it logs a warning and stops the signature request.
If the transport type is "fallback", it creates a `FallbackProvider` with multiple transports.
Otherwise, it creates a `JsonRpcProvider` with a single transport.

Ref: https://viem.sh/docs/ethers-migration.html

#### Parameters

| Name           | Type     | Description                             |
| :------------- | :------- | :-------------------------------------- |
| `publicClient` | `Object` | The `PublicClient` instance to convert. |

#### Returns

`undefined` \| `FallbackProvider` \| `JsonRpcProvider`

An ethers.js `Provider` instance, or `undefined` if no chain is found in the `PublicClient`.

#### Defined in

sdk/src/utils/adapters.ts:19

---

### validateAllowlist

▸ **validateAllowlist**(`data`, `units`): [`ValidationResult`](modules/internal.md#validationresult)

Validates an array of allowlist entries.

This function checks that the total units in the allowlist match the expected total units, that the total units are greater than 0,
and that all addresses in the allowlist are valid Ethereum addresses. It returns an object that includes a validity flag and any errors that occurred during validation.

#### Parameters

| Name    | Type                                            | Description                                                                                                       |
| :------ | :---------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| `data`  | [`AllowlistEntry`](modules.md#allowlistentry)[] | The allowlist entries to validate. Each entry should be an object that includes an address and a number of units. |
| `units` | `bigint`                                        | The expected total units in the allowlist.                                                                        |

#### Returns

[`ValidationResult`](modules/internal.md#validationresult)

An object that includes a validity flag and any errors that occurred during validation. The keys in the errors object are the names of the invalid properties, and the values are the error messages.

#### Defined in

sdk/src/validator/index.ts:108

---

### validateClaimData

▸ **validateClaimData**(`data`): [`ValidationResult`](modules/internal.md#validationresult)

Validates Hypercert claim data.

This function uses the AJV library to validate the claim data. It first retrieves the schema for the claim data,
then validates the data against the schema. If the schema is not found, it returns an error. If the data does not
conform to the schema, it returns the validation errors. If the data is valid, it returns a success message.

#### Parameters

| Name   | Type      | Description                                                                                        |
| :----- | :-------- | :------------------------------------------------------------------------------------------------- |
| `data` | `unknown` | The claim data to validate. This should be an object that conforms to the HypercertClaimdata type. |

#### Returns

[`ValidationResult`](modules/internal.md#validationresult)

An object that includes a validity flag and any errors that occurred during validation.

#### Defined in

sdk/src/validator/index.ts:77

---

### validateDuplicateEvaluationData

▸ **validateDuplicateEvaluationData**(`data`): [`ValidationResult`](modules/internal.md#validationresult)

Validates duplicate evaluation data.

This function uses the AJV library to validate the duplicate evaluation data. It first retrieves the schema for the duplicate evaluation data,
then validates the data against the schema. If the schema is not found, it returns an error. If the data does not
conform to the schema, it returns the validation errors. If the data is valid, it returns a success message.

#### Parameters

| Name   | Type                                                       | Description                                                                                                        |
| :----- | :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| `data` | [`DuplicateEvaluation`](interfaces/DuplicateEvaluation.md) | The duplicate evaluation data to validate. This should be an object that conforms to the DuplicateEvaluation type. |

#### Returns

[`ValidationResult`](modules/internal.md#validationresult)

An object that includes a validity flag and any errors that occurred during validation.

#### Defined in

sdk/src/validator/index.ts:139

---

### validateMetaData

▸ **validateMetaData**(`data`): [`ValidationResult`](modules/internal.md#validationresult)

Validates Hypercert metadata.

This function uses the AJV library to validate the metadata. It first retrieves the schema for the metadata,
then validates the data against the schema. If the schema is not found, it returns an error. If the data does not
conform to the schema, it returns the validation errors. If the data is valid, it returns a success message.

#### Parameters

| Name   | Type      | Description                                                                                     |
| :----- | :-------- | :---------------------------------------------------------------------------------------------- |
| `data` | `unknown` | The metadata to validate. This should be an object that conforms to the HypercertMetadata type. |

#### Returns

[`ValidationResult`](modules/internal.md#validationresult)

An object that includes a validity flag and any errors that occurred during validation.

#### Defined in

sdk/src/validator/index.ts:46

---

### validateSimpleTextEvaluationData

▸ **validateSimpleTextEvaluationData**(`data`): [`ValidationResult`](modules/internal.md#validationresult)

Validates simple text evaluation data against a predefined schema.

This function uses the AJV library to validate the simple text evaluation data. It first retrieves the schema for the simple text evaluation data,
then validates the data against the schema. If the schema is not found, it returns an error. If the data does not
conform to the schema, it returns the validation errors. If the data is valid, it returns a success message.

#### Parameters

| Name   | Type                                                         | Description                                                                                                           |
| :----- | :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `data` | [`SimpleTextEvaluation`](interfaces/SimpleTextEvaluation.md) | The simple text evaluation data to validate. This should be an object that conforms to the SimpleTextEvaluation type. |

#### Returns

[`ValidationResult`](modules/internal.md#validationresult)

An object that includes a validity flag and any errors that occurred during validation.

#### Defined in

sdk/src/validator/index.ts:169

---

### verifyMerkleProof

▸ **verifyMerkleProof**(`root`, `signerAddress`, `units`, `proof`): `void`

Verifies a Merkle proof for a given root, signer address, units, and proof.

This function first checks if the signer address is a valid Ethereum address. If it's not, it throws a `MintingError`.
It then verifies the Merkle proof using the `StandardMerkleTree.verify` method. If the verification fails, it throws a `MintingError`.

#### Parameters

| Name            | Type       | Description                    |
| :-------------- | :--------- | :----------------------------- |
| `root`          | `string`   | The root of the Merkle tree.   |
| `signerAddress` | `string`   | The signer's Ethereum address. |
| `units`         | `bigint`   | The number of units.           |
| `proof`         | `string`[] | The Merkle proof to verify.    |

#### Returns

`void`

**`Throws`**

Will throw a `MintingError` if the signer address is invalid or if the Merkle proof verification fails.

#### Defined in

sdk/src/validator/index.ts:201

---

### verifyMerkleProofs

▸ **verifyMerkleProofs**(`roots`, `signerAddress`, `units`, `proofs`): `void`

Verifies multiple Merkle proofs for given roots, a signer address, units, and proofs.

This function first checks if the lengths of the roots, units, and proofs arrays are equal. If they're not, it throws a `MintingError`.
It then iterates over the arrays and verifies each Merkle proof using the `verifyMerkleProof` function. If any verification fails, it throws a `MintingError`.

#### Parameters

| Name            | Type         | Description                    |
| :-------------- | :----------- | :----------------------------- |
| `roots`         | `string`[]   | The roots of the Merkle trees. |
| `signerAddress` | `string`     | The signer's Ethereum address. |
| `units`         | `bigint`[]   | The numbers of units.          |
| `proofs`        | `string`[][] | The Merkle proofs to verify.   |

#### Returns

`void`

**`Throws`**

Will throw a `MintingError` if the lengths of the input arrays are not equal or if any Merkle proof verification fails.

#### Defined in

sdk/src/validator/index.ts:224

---

### walletClientToSigner

▸ **walletClientToSigner**(`walletClient`): `undefined` \| `Signer` & `TypedDataSigner`

This function converts a `WalletClient` instance to an ethers.js `Signer` to faciliate compatibility between ethers and viem.

It extracts the account, chain, and transport from the `WalletClient` and creates a network object.
If no chain is found in the `WalletClient`, it logs a warning and stops the signature request.
It then creates a `Web3Provider` with the transport and network, and gets a `Signer` from the provider using the account's address.

Ref: https://viem.sh/docs/ethers-migration.html

#### Parameters

| Name           | Type     | Description                             |
| :------------- | :------- | :-------------------------------------- |
| `walletClient` | `Object` | The `WalletClient` instance to convert. |

#### Returns

`undefined` \| `Signer` & `TypedDataSigner`

An ethers.js `Signer` instance, or `undefined` if no chain is found in the `WalletClient`.

#### Defined in

sdk/src/utils/adapters.ts:51
