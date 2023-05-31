[Hypercerts SDK Documentation](README.md) / Exports

# Hypercerts SDK Documentation

## Table of contents

### References

- [ClaimTokensByClaimQuery](modules.md#claimtokensbyclaimquery)

### Classes

- [ClientError](classes/ClientError.md)
- [FetchError](classes/FetchError.md)
- [HyperCertMinterFactory](classes/HyperCertMinterFactory.md)
- [HypercertClient](classes/HypercertClient.md)
- [InvalidOrMissingError](classes/InvalidOrMissingError.md)
- [MalformedDataError](classes/MalformedDataError.md)
- [MintingError](classes/MintingError.md)
- [StorageError](classes/StorageError.md)
- [UnknownSchemaError](classes/UnknownSchemaError.md)
- [UnsupportedChainError](classes/UnsupportedChainError.md)

### Interfaces

- [DuplicateEvaluation](interfaces/DuplicateEvaluation.md)
- [EASEvaluation](interfaces/EASEvaluation.md)
- [HypercertClaimdata](interfaces/HypercertClaimdata.md)
- [HypercertClientInterface](interfaces/HypercertClientInterface.md)
- [HypercertClientMethods](interfaces/HypercertClientMethods.md)
- [HypercertClientState](interfaces/HypercertClientState.md)
- [HypercertEvaluationSchema](interfaces/HypercertEvaluationSchema.md)
- [HypercertIndexerInterface](interfaces/HypercertIndexerInterface.md)
- [HypercertMetadata](interfaces/HypercertMetadata.md)
- [HypercertMinter](interfaces/HypercertMinter.md)
- [HypercertPointer](interfaces/HypercertPointer.md)
- [HypercertStorageInterface](interfaces/HypercertStorageInterface.md)
- [IHypercertToken](interfaces/IHypercertToken.md)
- [IPFSEvaluation](interfaces/IPFSEvaluation.md)
- [SimpleTextEvaluation](interfaces/SimpleTextEvaluation.md)
- [TypedError](interfaces/TypedError.md)

### Type Aliases

- [Allowlist](modules.md#allowlist)
- [AllowlistEntry](modules.md#allowlistentry)
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
- [TransferRestrictions](modules.md#transferrestrictions)

### Properties

- [ClaimByIdQuery](modules.md#claimbyidquery)
- [HypercertMinterABI](modules.md#hypercertminterabi)
- [IHypercertTokenABI](modules.md#ihypercerttokenabi)

### Variables

- [INDEFINITE_DATE_STRING](modules.md#indefinite_date_string)
- [TransferRestrictions](modules.md#transferrestrictions-1)

### Functions

- [execute](modules.md#execute)
- [formatDate](modules.md#formatdate)
- [formatHypercertData](modules.md#formathypercertdata)
- [formatUnixTime](modules.md#formatunixtime)
- [validateAllowlist](modules.md#validateallowlist)
- [validateClaimData](modules.md#validateclaimdata)
- [validateDuplicateEvaluationData](modules.md#validateduplicateevaluationdata)
- [validateMetaData](modules.md#validatemetadata)
- [validateSimpleTextEvaluationData](modules.md#validatesimpletextevaluationdata)

## References

### ClaimTokensByClaimQuery

Renames and re-exports [ClaimByIdQuery](modules.md#claimbyidquery)

## Type Aliases

### Allowlist

Ƭ **Allowlist**: [`AllowlistEntry`](modules.md#allowlistentry)[]

Helper type to allow for a more readable Allowlist type

#### Defined in

[sdk/src/types/hypercerts.ts:30](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/hypercerts.ts#L30)

---

### AllowlistEntry

Ƭ **AllowlistEntry**: `Object`

Allowlist entry for Hypercerts matching the definitions in the Hypercerts protocol

**`Param`**

Address of the recipient

**`Param`**

Number of units allocated to the recipient

#### Type declaration

| Name      | Type           |
| :-------- | :------------- |
| `address` | `string`       |
| `units`   | `BigNumberish` |

#### Defined in

[sdk/src/types/hypercerts.ts:22](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/hypercerts.ts#L22)

---

### Deployment

Ƭ **Deployment**: `Object`

Represents a deployment of a contract on a specific network.

#### Type declaration

| Name              | Type     | Description                                                |
| :---------------- | :------- | :--------------------------------------------------------- |
| `chainId`         | `number` | The ID of the network on which the contract is deployed.   |
| `chainName`       | `string` | The name of the network on which the contract is deployed. |
| `contractAddress` | `string` | The address of the deployed contract.                      |
| `graphName`       | `string` | The name of the subgraph that indexes the contract events. |

#### Defined in

[sdk/src/types/client.ts:16](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L16)

---

### EvaluationData

Ƭ **EvaluationData**: [`DuplicateEvaluation`](interfaces/DuplicateEvaluation.md) \| [`SimpleTextEvaluation`](interfaces/SimpleTextEvaluation.md)

This file was automatically generated by json-schema-to-typescript.
DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
and run json-schema-to-typescript to regenerate this file.

#### Defined in

[sdk/src/types/evaluation.d.ts:8](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/evaluation.d.ts#L8)

---

### EvaluationSource

Ƭ **EvaluationSource**: [`EASEvaluation`](interfaces/EASEvaluation.md) \| [`IPFSEvaluation`](interfaces/IPFSEvaluation.md)

#### Defined in

[sdk/src/types/evaluation.d.ts:9](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/evaluation.d.ts#L9)

---

### HypercertClientConfig

Ƭ **HypercertClientConfig**: [`Deployment`](modules.md#deployment) & [`HypercertStorageConfig`](modules.md#hypercertstorageconfig) & [`HypercertEvaluatorConfig`](modules.md#hypercertevaluatorconfig) & { `provider`: `ethers.providers.Provider` ; `rpcUrl?`: `string` }

Configuration options for the Hypercert client.

#### Defined in

[sdk/src/types/client.ts:30](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L30)

---

### HypercertClientProps

Ƭ **HypercertClientProps**: `Object`

The props for the Hypercert client.

#### Type declaration

| Name      | Type                                                                    | Description                                         |
| :-------- | :---------------------------------------------------------------------- | :-------------------------------------------------- |
| `config?` | `Partial`<[`HypercertClientConfig`](modules.md#hypercertclientconfig)\> | The configuration options for the Hypercert client. |

#### Defined in

[sdk/src/types/client.ts:96](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L96)

---

### HypercertEvaluatorConfig

Ƭ **HypercertEvaluatorConfig**: `Omit`<`PartialTypedDataConfig`, `"address"`\> & { `easContractAddress`: `string` ; `signer`: `ethers.Signer` }

Configuration options for the Hypercert evaluator.

**`Note`**

The signer is required for submitting evaluations.

#### Defined in

[sdk/src/types/client.ts:54](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L54)

---

### HypercertStorageConfig

Ƭ **HypercertStorageConfig**: `Object`

Configuration options for the Hypercert storage layer.

**`Note`**

The API tokens are optional, but required for storing data on NFT.storage and Web3.storage.

#### Type declaration

| Name                | Type     | Description                     |
| :------------------ | :------- | :------------------------------ |
| `nftStorageToken?`  | `string` | The API token for NFT.storage.  |
| `web3StorageToken?` | `string` | The API token for Web3.storage. |

#### Defined in

[sdk/src/types/client.ts:43](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L43)

---

### HypercertsSdkError

Ƭ **HypercertsSdkError**: [`FetchError`](classes/FetchError.md) \| [`InvalidOrMissingError`](classes/InvalidOrMissingError.md) \| [`MalformedDataError`](classes/MalformedDataError.md) \| [`MintingError`](classes/MintingError.md) \| [`StorageError`](classes/StorageError.md) \| [`UnsupportedChainError`](classes/UnsupportedChainError.md) \| [`UnknownSchemaError`](classes/UnknownSchemaError.md)

#### Defined in

[sdk/src/types/errors.ts:152](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/errors.ts#L152)

---

### QueryParams

Ƭ **QueryParams**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name              | Type                |
| :---------------- | :------------------ |
| `first`           | `number`            |
| `orderDirections` | `"asc"` \| `"desc"` |
| `skip`            | `number`            |

#### Defined in

[sdk/src/types/indexer.ts:10](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/indexer.ts#L10)

---

### SupportedChainIds

Ƭ **SupportedChainIds**: `5` \| `10`

#### Defined in

[sdk/src/types/client.ts:11](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L11)

---

### TransferRestrictions

Ƭ **TransferRestrictions**: typeof [`TransferRestrictions`](modules.md#transferrestrictions-1)[keyof typeof [`TransferRestrictions`](modules.md#transferrestrictions-1)]

#### Defined in

[sdk/src/types/hypercerts.ts:9](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/hypercerts.ts#L9)

[sdk/src/types/hypercerts.ts:15](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/hypercerts.ts#L15)

## Properties

### ClaimByIdQuery

• **ClaimByIdQuery**: `any`

---

### HypercertMinterABI

• **HypercertMinterABI**: ({ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name?`: `undefined` = "balanceOf"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| { `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "AlreadyClaimed"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "error" } \| { `anonymous`: `boolean` = false; `inputs`: { `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "previousAdmin"; `type`: `string` = "address" }[] ; `name`: `string` = "AdminChanged"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| { `anonymous?`: `undefined` = false; `inputs`: { `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "balanceOf"; `outputs`: { `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[]

#### Defined in

contracts/dist/abi/HypercertMinter.json:1

---

### IHypercertTokenABI

• **IHypercertTokenABI**: ({ `anonymous`: `boolean` = false; `inputs`: { `indexed`: `boolean` = true; `internalType`: `string` = "uint256"; `name`: `string` = "claimID"; `type`: `string` = "uint256" }[] ; `name`: `string` = "ClaimStored"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| { `anonymous?`: `undefined` = false; `inputs`: { `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "unitsOf"; `outputs`: { `internalType`: `string` = "uint256"; `name`: `string` = "units"; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[]

#### Defined in

contracts/dist/abi/IHypercertToken.json:1

## Variables

### INDEFINITE_DATE_STRING

• `Const` **INDEFINITE_DATE_STRING**: `"indefinite"`

#### Defined in

[sdk/src/utils/formatter.ts:4](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/utils/formatter.ts#L4)

---

### TransferRestrictions

• `Const` **TransferRestrictions**: `Object`

Transfer restrictions for Hypercerts matching the definitions in the Hypercerts protocol

**`Dev`**

AllowAll: All transfers are allowed

**`Dev`**

DisallowAll: All transfers are disallowed

**`Dev`**

FromCreatorOnly: Only the creator can transfer the Hypercert

#### Type declaration

| Name              | Type |
| :---------------- | :--- |
| `AllowAll`        | `0`  |
| `DisallowAll`     | `1`  |
| `FromCreatorOnly` | `2`  |

#### Defined in

[sdk/src/types/hypercerts.ts:9](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/hypercerts.ts#L9)

[sdk/src/types/hypercerts.ts:15](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/hypercerts.ts#L15)

## Functions

### execute

▸ **execute**(`document`, `variables`, `context?`, `rootValue?`, `operationName?`): `Promise`<`ExecutionResult`<`any`, `ObjMap`<`unknown`\>\>\>

#### Parameters

| Name             | Type                              |
| :--------------- | :-------------------------------- |
| `document`       | `GraphQLOperation`<`any`, `any`\> |
| `variables`      | `any`                             |
| `context?`       | `any`                             |
| `rootValue?`     | `any`                             |
| `operationName?` | `string`                          |

#### Returns

`Promise`<`ExecutionResult`<`any`, `ObjMap`<`unknown`\>\>\>

#### Defined in

node_modules/@graphql-mesh/runtime/typings/types.d.ts:25

---

### formatDate

▸ **formatDate**(`date`): `string`

#### Parameters

| Name   | Type   |
| :----- | :----- |
| `date` | `Date` |

#### Returns

`string`

#### Defined in

[sdk/src/utils/formatter.ts:13](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/utils/formatter.ts#L13)

---

### formatHypercertData

▸ **formatHypercertData**(`«destructured»`): `FormatResult`

Formats input data to an object containing HypercertMetadata including appropriate labels

#### Parameters

| Name                     | Type                                             |
| :----------------------- | :----------------------------------------------- |
| `«destructured»`         | `Object`                                         |
| › `contributors`         | `string`[]                                       |
| › `description`          | `string`                                         |
| › `excludedImpactScope`  | `string`[]                                       |
| › `excludedRights`       | `string`[]                                       |
| › `excludedWorkScope`    | `string`[]                                       |
| › `external_url?`        | `string`                                         |
| › `image`                | `string`                                         |
| › `impactScope`          | `string`[]                                       |
| › `impactTimeframeEnd`   | `number`                                         |
| › `impactTimeframeStart` | `number`                                         |
| › `name`                 | `string`                                         |
| › `properties?`          | { `trait_type`: `string` ; `value`: `string` }[] |
| › `rights`               | `string`[]                                       |
| › `version`              | `string`                                         |
| › `workScope`            | `string`[]                                       |
| › `workTimeframeEnd`     | `number`                                         |
| › `workTimeframeStart`   | `number`                                         |

#### Returns

`FormatResult`

#### Defined in

[sdk/src/utils/formatter.ts:27](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/utils/formatter.ts#L27)

---

### formatUnixTime

▸ **formatUnixTime**(`seconds`): `string`

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `seconds` | `number` |

#### Returns

`string`

#### Defined in

[sdk/src/utils/formatter.ts:5](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/utils/formatter.ts#L5)

---

### validateAllowlist

▸ **validateAllowlist**(`data`, `units`): `Object`

Validates the data for an allowlist.

#### Parameters

| Name    | Type                                | Description                                 |
| :------ | :---------------------------------- | :------------------------------------------ |
| `data`  | [`Allowlist`](modules.md#allowlist) | The data to validate.                       |
| `units` | `BigNumberish`                      | The total number of units in the allowlist. |

#### Returns

`Object`

A `ValidationResult` object indicating whether the data is valid and any errors that were found.

| Name     | Type                                        |
| :------- | :------------------------------------------ |
| `errors` | `Record`<`string`, `string` \| `string`[]\> |
| `valid`  | `boolean`                                   |

#### Defined in

[sdk/src/validator/index.ts:89](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/validator/index.ts#L89)

---

### validateClaimData

▸ **validateClaimData**(`data`): `ValidationResult`

Validates the data for a simple text evaluation.

#### Parameters

| Name   | Type                                                     | Description           |
| :----- | :------------------------------------------------------- | :-------------------- |
| `data` | [`HypercertClaimdata`](interfaces/HypercertClaimdata.md) | The data to validate. |

#### Returns

`ValidationResult`

A `ValidationResult` object indicating whether the data is valid and any errors that were found.

#### Defined in

[sdk/src/validator/index.ts:62](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/validator/index.ts#L62)

---

### validateDuplicateEvaluationData

▸ **validateDuplicateEvaluationData**(`data`): `ValidationResult`

Validates the data for a duplicate evaluation.

#### Parameters

| Name   | Type                                                       | Description           |
| :----- | :--------------------------------------------------------- | :-------------------- |
| `data` | [`DuplicateEvaluation`](interfaces/DuplicateEvaluation.md) | The data to validate. |

#### Returns

`ValidationResult`

A `ValidationResult` object indicating whether the data is valid and any errors that were found.

#### Defined in

[sdk/src/validator/index.ts:111](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/validator/index.ts#L111)

---

### validateMetaData

▸ **validateMetaData**(`data`): `ValidationResult`

Validates the data for a simple text evaluation.

#### Parameters

| Name   | Type                                                   | Description           |
| :----- | :----------------------------------------------------- | :-------------------- |
| `data` | [`HypercertMetadata`](interfaces/HypercertMetadata.md) | The data to validate. |

#### Returns

`ValidationResult`

A `ValidationResult` object indicating whether the data is valid and any errors that were found.

#### Defined in

[sdk/src/validator/index.ts:36](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/validator/index.ts#L36)

---

### validateSimpleTextEvaluationData

▸ **validateSimpleTextEvaluationData**(`data`): `ValidationResult`

Validates the data for a simple text evaluation.

#### Parameters

| Name   | Type                                                         | Description           |
| :----- | :----------------------------------------------------------- | :-------------------- |
| `data` | [`SimpleTextEvaluation`](interfaces/SimpleTextEvaluation.md) | The data to validate. |

#### Returns

`ValidationResult`

A `ValidationResult` object indicating whether the data is valid and any errors that were found.

#### Defined in

[sdk/src/validator/index.ts:136](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/validator/index.ts#L136)
