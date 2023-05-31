[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertMinter

# Interface: HypercertMinter

## Hierarchy

- `BaseContract`

  ↳ **`HypercertMinter`**

## Table of contents

### Properties

- [\_deployedPromise](HypercertMinter.md#_deployedpromise)
- [\_runningEvents](HypercertMinter.md#_runningevents)
- [\_wrappedEmits](HypercertMinter.md#_wrappedemits)
- [address](HypercertMinter.md#address)
- [callStatic](HypercertMinter.md#callstatic)
- [deployTransaction](HypercertMinter.md#deploytransaction)
- [estimateGas](HypercertMinter.md#estimategas)
- [filters](HypercertMinter.md#filters)
- [functions](HypercertMinter.md#functions)
- [interface](HypercertMinter.md#interface)
- [off](HypercertMinter.md#off)
- [on](HypercertMinter.md#on)
- [once](HypercertMinter.md#once)
- [populateTransaction](HypercertMinter.md#populatetransaction)
- [provider](HypercertMinter.md#provider)
- [removeListener](HypercertMinter.md#removelistener)
- [resolvedAddress](HypercertMinter.md#resolvedaddress)
- [signer](HypercertMinter.md#signer)

### Methods

- [\_\_SemiFungible1155_init](HypercertMinter.md#__semifungible1155_init)
- [\_checkRunningEvents](HypercertMinter.md#_checkrunningevents)
- [\_deployed](HypercertMinter.md#_deployed)
- [\_wrapEvent](HypercertMinter.md#_wrapevent)
- [attach](HypercertMinter.md#attach)
- [balanceOf](HypercertMinter.md#balanceof)
- [balanceOfBatch](HypercertMinter.md#balanceofbatch)
- [batchMintClaimsFromAllowlists](HypercertMinter.md#batchmintclaimsfromallowlists)
- [burn](HypercertMinter.md#burn)
- [burnBatch](HypercertMinter.md#burnbatch)
- [burnFraction](HypercertMinter.md#burnfraction)
- [connect](HypercertMinter.md#connect)
- [createAllowlist](HypercertMinter.md#createallowlist)
- [deployed](HypercertMinter.md#deployed)
- [emit](HypercertMinter.md#emit)
- [fallback](HypercertMinter.md#fallback)
- [hasBeenClaimed](HypercertMinter.md#hasbeenclaimed)
- [initialize](HypercertMinter.md#initialize)
- [isAllowedToClaim](HypercertMinter.md#isallowedtoclaim)
- [isApprovedForAll](HypercertMinter.md#isapprovedforall)
- [listenerCount](HypercertMinter.md#listenercount)
- [listeners](HypercertMinter.md#listeners)
- [mergeFractions](HypercertMinter.md#mergefractions)
- [mintClaim](HypercertMinter.md#mintclaim)
- [mintClaimFromAllowlist](HypercertMinter.md#mintclaimfromallowlist)
- [mintClaimWithFractions](HypercertMinter.md#mintclaimwithfractions)
- [name](HypercertMinter.md#name)
- [owner](HypercertMinter.md#owner)
- [ownerOf](HypercertMinter.md#ownerof)
- [pause](HypercertMinter.md#pause)
- [paused](HypercertMinter.md#paused)
- [proxiableUUID](HypercertMinter.md#proxiableuuid)
- [queryFilter](HypercertMinter.md#queryfilter)
- [readTransferRestriction](HypercertMinter.md#readtransferrestriction)
- [removeAllListeners](HypercertMinter.md#removealllisteners)
- [renounceOwnership](HypercertMinter.md#renounceownership)
- [safeBatchTransferFrom](HypercertMinter.md#safebatchtransferfrom)
- [safeTransferFrom](HypercertMinter.md#safetransferfrom)
- [setApprovalForAll](HypercertMinter.md#setapprovalforall)
- [splitFraction](HypercertMinter.md#splitfraction)
- [supportsInterface](HypercertMinter.md#supportsinterface)
- [transferOwnership](HypercertMinter.md#transferownership)
- [unitsOf(address,uint256)](<HypercertMinter.md#unitsof(address,uint256)>)
- [unitsOf(uint256)](<HypercertMinter.md#unitsof(uint256)>)
- [unpause](HypercertMinter.md#unpause)
- [upgradeTo](HypercertMinter.md#upgradeto)
- [upgradeToAndCall](HypercertMinter.md#upgradetoandcall)
- [uri](HypercertMinter.md#uri)

## Properties

### \_deployedPromise

• **\_deployedPromise**: `Promise`<`Contract`\>

#### Inherited from

BaseContract.\_deployedPromise

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:100

---

### \_runningEvents

• **\_runningEvents**: `Object`

#### Index signature

▪ [eventTag: `string`]: `RunningEvent`

#### Inherited from

BaseContract.\_runningEvents

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:101

---

### \_wrappedEmits

• **\_wrappedEmits**: `Object`

#### Index signature

▪ [eventTag: `string`]: (...`args`: `any`[]) => `void`

#### Inherited from

BaseContract.\_wrappedEmits

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:104

---

### address

• `Readonly` **address**: `string`

#### Inherited from

BaseContract.address

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:79

---

### callStatic

• **callStatic**: `Object`

#### Type declaration

| Name                            | Type                                                                                                                                                                                                                                                                                |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__SemiFungible1155_init`       | (`overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                                                                                                               |
| `balanceOf`                     | (`account`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                         |
| `balanceOfBatch`                | (`accounts`: `PromiseOrValue`<`string`\>[], `ids`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`[]\>                                                                                                                                 |
| `batchMintClaimsFromAllowlists` | (`account`: `PromiseOrValue`<`string`\>, `proofs`: `PromiseOrValue`<`BytesLike`\>[][], `claimIDs`: `PromiseOrValue`<`BigNumberish`\>[], `units`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                          |
| `burn`                          | (`account`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                  |
| `burnBatch`                     | (`account`: `PromiseOrValue`<`string`\>, `ids`: `PromiseOrValue`<`BigNumberish`\>[], `values`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                            |
| `burnFraction`                  | (`_account`: `PromiseOrValue`<`string`\>, `_tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                       |
| `createAllowlist`               | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `merkleRoot`: `PromiseOrValue`<`BytesLike`\>, `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>     |
| `hasBeenClaimed`                | (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `arg1`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\>                                                                                                                                         |
| `initialize`                    | (`overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                                                                                                               |
| `isAllowedToClaim`              | (`proof`: `PromiseOrValue`<`BytesLike`\>[], `claimID`: `PromiseOrValue`<`BigNumberish`\>, `leaf`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\>                                                                                           |
| `isApprovedForAll`              | (`account`: `PromiseOrValue`<`string`\>, `operator`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\>                                                                                                                                           |
| `mergeFractions`                | (`_account`: `PromiseOrValue`<`string`\>, `_fractionIDs`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                 |
| `mintClaim`                     | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                   |
| `mintClaimFromAllowlist`        | (`account`: `PromiseOrValue`<`string`\>, `proof`: `PromiseOrValue`<`BytesLike`\>[], `claimID`: `PromiseOrValue`<`BigNumberish`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                  |
| `mintClaimWithFractions`        | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `fractions`: `PromiseOrValue`<`BigNumberish`\>[], `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> |
| `name`                          | (`overrides?`: `CallOverrides`) => `Promise`<`string`\>                                                                                                                                                                                                                             |
| `owner`                         | (`overrides?`: `CallOverrides`) => `Promise`<`string`\>                                                                                                                                                                                                                             |
| `ownerOf`                       | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`\>                                                                                                                                                                               |
| `pause`                         | (`overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                                                                                                               |
| `paused`                        | (`overrides?`: `CallOverrides`) => `Promise`<`boolean`\>                                                                                                                                                                                                                            |
| `proxiableUUID`                 | (`overrides?`: `CallOverrides`) => `Promise`<`string`\>                                                                                                                                                                                                                             |
| `readTransferRestriction`       | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`\>                                                                                                                                                                               |
| `renounceOwnership`             | (`overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                                                                                                               |
| `safeBatchTransferFrom`         | (`from`: `PromiseOrValue`<`string`\>, `to`: `PromiseOrValue`<`string`\>, `ids`: `PromiseOrValue`<`BigNumberish`\>[], `amounts`: `PromiseOrValue`<`BigNumberish`\>[], `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                   |
| `safeTransferFrom`              | (`from`: `PromiseOrValue`<`string`\>, `to`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                         |
| `setApprovalForAll`             | (`operator`: `PromiseOrValue`<`string`\>, `approved`: `PromiseOrValue`<`boolean`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                            |
| `splitFraction`                 | (`_account`: `PromiseOrValue`<`string`\>, `_tokenID`: `PromiseOrValue`<`BigNumberish`\>, `_newFractions`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                 |
| `supportsInterface`             | (`interfaceId`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`boolean`\>                                                                                                                                                                             |
| `transferOwnership`             | (`newOwner`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                                                                      |
| `unitsOf(address,uint256)`      | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                    |
| `unitsOf(uint256)`              | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                            |
| `unpause`                       | (`overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                                                                                                               |
| `upgradeTo`                     | (`newImplementation`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                                                             |
| `upgradeToAndCall`              | (`newImplementation`: `PromiseOrValue`<`string`\>, `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                     |
| `uri`                           | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`\>                                                                                                                                                                               |

#### Overrides

BaseContract.callStatic

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:536

---

### deployTransaction

• `Readonly` **deployTransaction**: `TransactionResponse`

#### Inherited from

BaseContract.deployTransaction

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:99

---

### estimateGas

• **estimateGas**: `Object`

#### Type declaration

| Name                            | Type                                                                                                                                                                                                                                                                                                                            |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `__SemiFungible1155_init`       | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                               |
| `balanceOf`                     | (`account`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                     |
| `balanceOfBatch`                | (`accounts`: `PromiseOrValue`<`string`\>[], `ids`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                               |
| `batchMintClaimsFromAllowlists` | (`account`: `PromiseOrValue`<`string`\>, `proofs`: `PromiseOrValue`<`BytesLike`\>[][], `claimIDs`: `PromiseOrValue`<`BigNumberish`\>[], `units`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                          |
| `burn`                          | (`account`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                  |
| `burnBatch`                     | (`account`: `PromiseOrValue`<`string`\>, `ids`: `PromiseOrValue`<`BigNumberish`\>[], `values`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                            |
| `burnFraction`                  | (`_account`: `PromiseOrValue`<`string`\>, `_tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                       |
| `createAllowlist`               | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `merkleRoot`: `PromiseOrValue`<`BytesLike`\>, `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>     |
| `hasBeenClaimed`                | (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `arg1`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                   |
| `initialize`                    | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                               |
| `isAllowedToClaim`              | (`proof`: `PromiseOrValue`<`BytesLike`\>[], `claimID`: `PromiseOrValue`<`BigNumberish`\>, `leaf`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                     |
| `isApprovedForAll`              | (`account`: `PromiseOrValue`<`string`\>, `operator`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                     |
| `mergeFractions`                | (`_account`: `PromiseOrValue`<`string`\>, `_fractionIDs`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                 |
| `mintClaim`                     | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                   |
| `mintClaimFromAllowlist`        | (`account`: `PromiseOrValue`<`string`\>, `proof`: `PromiseOrValue`<`BytesLike`\>[], `claimID`: `PromiseOrValue`<`BigNumberish`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                  |
| `mintClaimWithFractions`        | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `fractions`: `PromiseOrValue`<`BigNumberish`\>[], `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\> |
| `name`                          | (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                                                                      |
| `owner`                         | (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                                                                      |
| `ownerOf`                       | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                        |
| `pause`                         | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                               |
| `paused`                        | (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                                                                      |
| `proxiableUUID`                 | (`overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                                                                      |
| `readTransferRestriction`       | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                        |
| `renounceOwnership`             | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                               |
| `safeBatchTransferFrom`         | (`from`: `PromiseOrValue`<`string`\>, `to`: `PromiseOrValue`<`string`\>, `ids`: `PromiseOrValue`<`BigNumberish`\>[], `amounts`: `PromiseOrValue`<`BigNumberish`\>[], `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                   |
| `safeTransferFrom`              | (`from`: `PromiseOrValue`<`string`\>, `to`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                         |
| `setApprovalForAll`             | (`operator`: `PromiseOrValue`<`string`\>, `approved`: `PromiseOrValue`<`boolean`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                            |
| `splitFraction`                 | (`_account`: `PromiseOrValue`<`string`\>, `_tokenID`: `PromiseOrValue`<`BigNumberish`\>, `_newFractions`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                 |
| `supportsInterface`             | (`interfaceId`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                       |
| `transferOwnership`             | (`newOwner`: `PromiseOrValue`<`string`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                                                                      |
| `unitsOf(address,uint256)`      | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                |
| `unitsOf(uint256)`              | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                        |
| `unpause`                       | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                               |
| `upgradeTo`                     | (`newImplementation`: `PromiseOrValue`<`string`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                                                             |
| `upgradeToAndCall`              | (`newImplementation`: `PromiseOrValue`<`string`\>, `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `PayableOverrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                              |
| `uri`                           | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                        |

#### Overrides

BaseContract.estimateGas

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:608

---

### filters

• **filters**: `Object`

#### Type declaration

| Name                                                          | Type                                                                                                                                                                                                                |
| :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AdminChanged`                                                | (`previousAdmin?`: `null`, `newAdmin?`: `null`) => `AdminChangedEventFilter`                                                                                                                                        |
| `AdminChanged(address,address)`                               | (`previousAdmin?`: `null`, `newAdmin?`: `null`) => `AdminChangedEventFilter`                                                                                                                                        |
| `AllowlistCreated`                                            | (`tokenID?`: `null`, `root?`: `null`) => `AllowlistCreatedEventFilter`                                                                                                                                              |
| `AllowlistCreated(uint256,bytes32)`                           | (`tokenID?`: `null`, `root?`: `null`) => `AllowlistCreatedEventFilter`                                                                                                                                              |
| `ApprovalForAll`                                              | (`account?`: `null` \| `PromiseOrValue`<`string`\>, `operator?`: `null` \| `PromiseOrValue`<`string`\>, `approved?`: `null`) => `ApprovalForAllEventFilter`                                                         |
| `ApprovalForAll(address,address,bool)`                        | (`account?`: `null` \| `PromiseOrValue`<`string`\>, `operator?`: `null` \| `PromiseOrValue`<`string`\>, `approved?`: `null`) => `ApprovalForAllEventFilter`                                                         |
| `BatchValueTransfer`                                          | (`claimIDs?`: `null`, `fromTokenIDs?`: `null`, `toTokenIDs?`: `null`, `values?`: `null`) => `BatchValueTransferEventFilter`                                                                                         |
| `BatchValueTransfer(uint256[],uint256[],uint256[],uint256[])` | (`claimIDs?`: `null`, `fromTokenIDs?`: `null`, `toTokenIDs?`: `null`, `values?`: `null`) => `BatchValueTransferEventFilter`                                                                                         |
| `BeaconUpgraded`                                              | (`beacon?`: `null` \| `PromiseOrValue`<`string`\>) => `BeaconUpgradedEventFilter`                                                                                                                                   |
| `BeaconUpgraded(address)`                                     | (`beacon?`: `null` \| `PromiseOrValue`<`string`\>) => `BeaconUpgradedEventFilter`                                                                                                                                   |
| `ClaimStored`                                                 | (`claimID?`: `null` \| `PromiseOrValue`<`BigNumberish`\>, `uri?`: `null`, `totalUnits?`: `null`) => `ClaimStoredEventFilter`                                                                                        |
| `ClaimStored(uint256,string,uint256)`                         | (`claimID?`: `null` \| `PromiseOrValue`<`BigNumberish`\>, `uri?`: `null`, `totalUnits?`: `null`) => `ClaimStoredEventFilter`                                                                                        |
| `Initialized`                                                 | (`version?`: `null`) => `InitializedEventFilter`                                                                                                                                                                    |
| `Initialized(uint8)`                                          | (`version?`: `null`) => `InitializedEventFilter`                                                                                                                                                                    |
| `LeafClaimed`                                                 | (`tokenID?`: `null`, `leaf?`: `null`) => `LeafClaimedEventFilter`                                                                                                                                                   |
| `LeafClaimed(uint256,bytes32)`                                | (`tokenID?`: `null`, `leaf?`: `null`) => `LeafClaimedEventFilter`                                                                                                                                                   |
| `OwnershipTransferred`                                        | (`previousOwner?`: `null` \| `PromiseOrValue`<`string`\>, `newOwner?`: `null` \| `PromiseOrValue`<`string`\>) => `OwnershipTransferredEventFilter`                                                                  |
| `OwnershipTransferred(address,address)`                       | (`previousOwner?`: `null` \| `PromiseOrValue`<`string`\>, `newOwner?`: `null` \| `PromiseOrValue`<`string`\>) => `OwnershipTransferredEventFilter`                                                                  |
| `Paused`                                                      | (`account?`: `null`) => `PausedEventFilter`                                                                                                                                                                         |
| `Paused(address)`                                             | (`account?`: `null`) => `PausedEventFilter`                                                                                                                                                                         |
| `TransferBatch`                                               | (`operator?`: `null` \| `PromiseOrValue`<`string`\>, `from?`: `null` \| `PromiseOrValue`<`string`\>, `to?`: `null` \| `PromiseOrValue`<`string`\>, `ids?`: `null`, `values?`: `null`) => `TransferBatchEventFilter` |
| `TransferBatch(address,address,address,uint256[],uint256[])`  | (`operator?`: `null` \| `PromiseOrValue`<`string`\>, `from?`: `null` \| `PromiseOrValue`<`string`\>, `to?`: `null` \| `PromiseOrValue`<`string`\>, `ids?`: `null`, `values?`: `null`) => `TransferBatchEventFilter` |
| `TransferSingle`                                              | (`operator?`: `null` \| `PromiseOrValue`<`string`\>, `from?`: `null` \| `PromiseOrValue`<`string`\>, `to?`: `null` \| `PromiseOrValue`<`string`\>, `id?`: `null`, `value?`: `null`) => `TransferSingleEventFilter`  |
| `TransferSingle(address,address,address,uint256,uint256)`     | (`operator?`: `null` \| `PromiseOrValue`<`string`\>, `from?`: `null` \| `PromiseOrValue`<`string`\>, `to?`: `null` \| `PromiseOrValue`<`string`\>, `id?`: `null`, `value?`: `null`) => `TransferSingleEventFilter`  |
| `URI`                                                         | (`value?`: `null`, `id?`: `null` \| `PromiseOrValue`<`BigNumberish`\>) => `URIEventFilter`                                                                                                                          |
| `URI(string,uint256)`                                         | (`value?`: `null`, `id?`: `null` \| `PromiseOrValue`<`BigNumberish`\>) => `URIEventFilter`                                                                                                                          |
| `Unpaused`                                                    | (`account?`: `null`) => `UnpausedEventFilter`                                                                                                                                                                       |
| `Unpaused(address)`                                           | (`account?`: `null`) => `UnpausedEventFilter`                                                                                                                                                                       |
| `Upgraded`                                                    | (`implementation?`: `null` \| `PromiseOrValue`<`string`\>) => `UpgradedEventFilter`                                                                                                                                 |
| `Upgraded(address)`                                           | (`implementation?`: `null` \| `PromiseOrValue`<`string`\>) => `UpgradedEventFilter`                                                                                                                                 |
| `ValueTransfer`                                               | (`claimID?`: `null`, `fromTokenID?`: `null`, `toTokenID?`: `null`, `value?`: `null`) => `ValueTransferEventFilter`                                                                                                  |
| `ValueTransfer(uint256,uint256,uint256,uint256)`              | (`claimID?`: `null`, `fromTokenID?`: `null`, `toTokenID?`: `null`, `value?`: `null`) => `ValueTransferEventFilter`                                                                                                  |

#### Overrides

BaseContract.filters

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:574

---

### functions

• **functions**: `Object`

#### Type declaration

| Name                            | Type                                                                                                                                                                                                                                                                                                                                      |
| :------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__SemiFungible1155_init`       | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                                                                                                               |
| `balanceOf`                     | (`account`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`]\>                                                                                                                                                                                             |
| `balanceOfBatch`                | (`accounts`: `PromiseOrValue`<`string`\>[], `ids`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`[]]\>                                                                                                                                                                                     |
| `batchMintClaimsFromAllowlists` | (`account`: `PromiseOrValue`<`string`\>, `proofs`: `PromiseOrValue`<`BytesLike`\>[][], `claimIDs`: `PromiseOrValue`<`BigNumberish`\>[], `units`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                          |
| `burn`                          | (`account`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                  |
| `burnBatch`                     | (`account`: `PromiseOrValue`<`string`\>, `ids`: `PromiseOrValue`<`BigNumberish`\>[], `values`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                            |
| `burnFraction`                  | (`_account`: `PromiseOrValue`<`string`\>, `_tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                       |
| `createAllowlist`               | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `merkleRoot`: `PromiseOrValue`<`BytesLike`\>, `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>     |
| `hasBeenClaimed`                | (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `arg1`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<[`boolean`]\>                                                                                                                                                                                             |
| `initialize`                    | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                                                                                                               |
| `isAllowedToClaim`              | (`proof`: `PromiseOrValue`<`BytesLike`\>[], `claimID`: `PromiseOrValue`<`BigNumberish`\>, `leaf`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<[`boolean`] & { `isAllowed`: `boolean` }\>                                                                                                                  |
| `isApprovedForAll`              | (`account`: `PromiseOrValue`<`string`\>, `operator`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<[`boolean`]\>                                                                                                                                                                                               |
| `mergeFractions`                | (`_account`: `PromiseOrValue`<`string`\>, `_fractionIDs`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                 |
| `mintClaim`                     | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                   |
| `mintClaimFromAllowlist`        | (`account`: `PromiseOrValue`<`string`\>, `proof`: `PromiseOrValue`<`BytesLike`\>[], `claimID`: `PromiseOrValue`<`BigNumberish`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                  |
| `mintClaimWithFractions`        | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `fractions`: `PromiseOrValue`<`BigNumberish`\>[], `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\> |
| `name`                          | (`overrides?`: `CallOverrides`) => `Promise`<[`string`]\>                                                                                                                                                                                                                                                                                 |
| `owner`                         | (`overrides?`: `CallOverrides`) => `Promise`<[`string`]\>                                                                                                                                                                                                                                                                                 |
| `ownerOf`                       | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`] & { `_owner`: `string` }\>                                                                                                                                                                                                          |
| `pause`                         | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                                                                                                               |
| `paused`                        | (`overrides?`: `CallOverrides`) => `Promise`<[`boolean`]\>                                                                                                                                                                                                                                                                                |
| `proxiableUUID`                 | (`overrides?`: `CallOverrides`) => `Promise`<[`string`]\>                                                                                                                                                                                                                                                                                 |
| `readTransferRestriction`       | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`]\>                                                                                                                                                                                                                                   |
| `renounceOwnership`             | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                                                                                                               |
| `safeBatchTransferFrom`         | (`from`: `PromiseOrValue`<`string`\>, `to`: `PromiseOrValue`<`string`\>, `ids`: `PromiseOrValue`<`BigNumberish`\>[], `amounts`: `PromiseOrValue`<`BigNumberish`\>[], `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                   |
| `safeTransferFrom`              | (`from`: `PromiseOrValue`<`string`\>, `to`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                         |
| `setApprovalForAll`             | (`operator`: `PromiseOrValue`<`string`\>, `approved`: `PromiseOrValue`<`boolean`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                            |
| `splitFraction`                 | (`_account`: `PromiseOrValue`<`string`\>, `_tokenID`: `PromiseOrValue`<`BigNumberish`\>, `_newFractions`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                 |
| `supportsInterface`             | (`interfaceId`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<[`boolean`]\>                                                                                                                                                                                                                                 |
| `transferOwnership`             | (`newOwner`: `PromiseOrValue`<`string`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                                                                      |
| `unitsOf(address,uint256)`      | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`] & { `units`: `BigNumber` }\>                                                                                                                                                             |
| `unitsOf(uint256)`              | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`] & { `units`: `BigNumber` }\>                                                                                                                                                                                                     |
| `unpause`                       | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                                                                                                               |
| `upgradeTo`                     | (`newImplementation`: `PromiseOrValue`<`string`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                                                             |
| `upgradeToAndCall`              | (`newImplementation`: `PromiseOrValue`<`string`\>, `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `PayableOverrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                              |
| `uri`                           | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`] & { `_uri`: `string` }\>                                                                                                                                                                                                            |

#### Overrides

BaseContract.functions

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:368

---

### interface

• **interface**: `HypercertMinterInterface`

#### Overrides

BaseContract.interface

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:358

---

### off

• **off**: `OnEvent`<[`HypercertMinter`](HypercertMinter.md)\>

#### Overrides

BaseContract.off

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:364

---

### on

• **on**: `OnEvent`<[`HypercertMinter`](HypercertMinter.md)\>

#### Overrides

BaseContract.on

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:365

---

### once

• **once**: `OnEvent`<[`HypercertMinter`](HypercertMinter.md)\>

#### Overrides

BaseContract.once

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:366

---

### populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name                            | Type                                                                                                                                                                                                                                                                                                                                       |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `__SemiFungible1155_init`       | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                               |
| `balanceOf`                     | (`account`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                     |
| `balanceOfBatch`                | (`accounts`: `PromiseOrValue`<`string`\>[], `ids`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                               |
| `batchMintClaimsFromAllowlists` | (`account`: `PromiseOrValue`<`string`\>, `proofs`: `PromiseOrValue`<`BytesLike`\>[][], `claimIDs`: `PromiseOrValue`<`BigNumberish`\>[], `units`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                          |
| `burn`                          | (`account`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `value`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                  |
| `burnBatch`                     | (`account`: `PromiseOrValue`<`string`\>, `ids`: `PromiseOrValue`<`BigNumberish`\>[], `values`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                            |
| `burnFraction`                  | (`_account`: `PromiseOrValue`<`string`\>, `_tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                       |
| `createAllowlist`               | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `merkleRoot`: `PromiseOrValue`<`BytesLike`\>, `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>     |
| `hasBeenClaimed`                | (`arg0`: `PromiseOrValue`<`BigNumberish`\>, `arg1`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                   |
| `initialize`                    | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                               |
| `isAllowedToClaim`              | (`proof`: `PromiseOrValue`<`BytesLike`\>[], `claimID`: `PromiseOrValue`<`BigNumberish`\>, `leaf`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                     |
| `isApprovedForAll`              | (`account`: `PromiseOrValue`<`string`\>, `operator`: `PromiseOrValue`<`string`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                     |
| `mergeFractions`                | (`_account`: `PromiseOrValue`<`string`\>, `_fractionIDs`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                 |
| `mintClaim`                     | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                   |
| `mintClaimFromAllowlist`        | (`account`: `PromiseOrValue`<`string`\>, `proof`: `PromiseOrValue`<`BytesLike`\>[], `claimID`: `PromiseOrValue`<`BigNumberish`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                  |
| `mintClaimWithFractions`        | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `fractions`: `PromiseOrValue`<`BigNumberish`\>[], `_uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\> |
| `name`                          | (`overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                                                                      |
| `owner`                         | (`overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                                                                      |
| `ownerOf`                       | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                        |
| `pause`                         | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                               |
| `paused`                        | (`overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                                                                      |
| `proxiableUUID`                 | (`overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                                                                      |
| `readTransferRestriction`       | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                        |
| `renounceOwnership`             | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                               |
| `safeBatchTransferFrom`         | (`from`: `PromiseOrValue`<`string`\>, `to`: `PromiseOrValue`<`string`\>, `ids`: `PromiseOrValue`<`BigNumberish`\>[], `amounts`: `PromiseOrValue`<`BigNumberish`\>[], `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                   |
| `safeTransferFrom`              | (`from`: `PromiseOrValue`<`string`\>, `to`: `PromiseOrValue`<`string`\>, `id`: `PromiseOrValue`<`BigNumberish`\>, `amount`: `PromiseOrValue`<`BigNumberish`\>, `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                         |
| `setApprovalForAll`             | (`operator`: `PromiseOrValue`<`string`\>, `approved`: `PromiseOrValue`<`boolean`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                            |
| `splitFraction`                 | (`_account`: `PromiseOrValue`<`string`\>, `_tokenID`: `PromiseOrValue`<`BigNumberish`\>, `_newFractions`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                 |
| `supportsInterface`             | (`interfaceId`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                       |
| `transferOwnership`             | (`newOwner`: `PromiseOrValue`<`string`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                      |
| `unitsOf(address,uint256)`      | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                |
| `unitsOf(uint256)`              | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                        |
| `unpause`                       | (`overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                               |
| `upgradeTo`                     | (`newImplementation`: `PromiseOrValue`<`string`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                             |
| `upgradeToAndCall`              | (`newImplementation`: `PromiseOrValue`<`string`\>, `data`: `PromiseOrValue`<`BytesLike`\>, `overrides?`: `PayableOverrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                              |
| `uri`                           | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                        |

#### Overrides

BaseContract.populateTransaction

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:688

---

### provider

• `Readonly` **provider**: `Provider`

#### Inherited from

BaseContract.provider

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:82

---

### removeListener

• **removeListener**: `OnEvent`<[`HypercertMinter`](HypercertMinter.md)\>

#### Overrides

BaseContract.removeListener

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:367

---

### resolvedAddress

• `Readonly` **resolvedAddress**: `Promise`<`string`\>

#### Inherited from

BaseContract.resolvedAddress

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:98

---

### signer

• `Readonly` **signer**: `Signer`

#### Inherited from

BaseContract.signer

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:81

## Methods

### \_\_SemiFungible1155_init

▸ **\_\_SemiFungible1155_init**(`overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:458

---

### \_checkRunningEvents

▸ **\_checkRunningEvents**(`runningEvent`): `void`

#### Parameters

| Name           | Type           |
| :------------- | :------------- |
| `runningEvent` | `RunningEvent` |

#### Returns

`void`

#### Inherited from

BaseContract.\_checkRunningEvents

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:121

---

### \_deployed

▸ **\_deployed**(`blockTag?`): `Promise`<`Contract`\>

#### Parameters

| Name        | Type       |
| :---------- | :--------- |
| `blockTag?` | `BlockTag` |

#### Returns

`Promise`<`Contract`\>

#### Inherited from

BaseContract.\_deployed

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:114

---

### \_wrapEvent

▸ **\_wrapEvent**(`runningEvent`, `log`, `listener`): `Event`

#### Parameters

| Name           | Type           |
| :------------- | :------------- |
| `runningEvent` | `RunningEvent` |
| `log`          | `Log`          |
| `listener`     | `Listener`     |

#### Returns

`Event`

#### Inherited from

BaseContract.\_wrapEvent

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:122

---

### attach

▸ **attach**(`addressOrName`): [`HypercertMinter`](HypercertMinter.md)

#### Parameters

| Name            | Type     |
| :-------------- | :------- |
| `addressOrName` | `string` |

#### Returns

[`HypercertMinter`](HypercertMinter.md)

#### Overrides

BaseContract.attach

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:356

---

### balanceOf

▸ **balanceOf**(`account`, `id`, `overrides?`): `Promise`<`BigNumber`\>

#### Parameters

| Name         | Type                              |
| :----------- | :-------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>       |
| `id`         | `PromiseOrValue`<`BigNumberish`\> |
| `overrides?` | `CallOverrides`                   |

#### Returns

`Promise`<`BigNumber`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:461

---

### balanceOfBatch

▸ **balanceOfBatch**(`accounts`, `ids`, `overrides?`): `Promise`<`BigNumber`[]\>

#### Parameters

| Name         | Type                                |
| :----------- | :---------------------------------- |
| `accounts`   | `PromiseOrValue`<`string`\>[]       |
| `ids`        | `PromiseOrValue`<`BigNumberish`\>[] |
| `overrides?` | `CallOverrides`                     |

#### Returns

`Promise`<`BigNumber`[]\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:462

---

### batchMintClaimsFromAllowlists

▸ **batchMintClaimsFromAllowlists**(`account`, `proofs`, `claimIDs`, `units`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>                            |
| `proofs`     | `PromiseOrValue`<`BytesLike`\>[][]                     |
| `claimIDs`   | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `units`      | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:463

---

### burn

▸ **burn**(`account`, `id`, `value`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>                            |
| `id`         | `PromiseOrValue`<`BigNumberish`\>                      |
| `value`      | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:466

---

### burnBatch

▸ **burnBatch**(`account`, `ids`, `values`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>                            |
| `ids`        | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `values`     | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:469

---

### burnFraction

▸ **burnFraction**(`_account`, `_tokenID`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `_account`   | `PromiseOrValue`<`string`\>                            |
| `_tokenID`   | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:472

---

### connect

▸ **connect**(`signerOrProvider`): [`HypercertMinter`](HypercertMinter.md)

#### Parameters

| Name               | Type                               |
| :----------------- | :--------------------------------- |
| `signerOrProvider` | `string` \| `Provider` \| `Signer` |

#### Returns

[`HypercertMinter`](HypercertMinter.md)

#### Overrides

BaseContract.connect

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:355

---

### createAllowlist

▸ **createAllowlist**(`account`, `units`, `merkleRoot`, `_uri`, `restrictions`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name           | Type                                                   |
| :------------- | :----------------------------------------------------- |
| `account`      | `PromiseOrValue`<`string`\>                            |
| `units`        | `PromiseOrValue`<`BigNumberish`\>                      |
| `merkleRoot`   | `PromiseOrValue`<`BytesLike`\>                         |
| `_uri`         | `PromiseOrValue`<`string`\>                            |
| `restrictions` | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?`   | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:475

---

### deployed

▸ **deployed**(): `Promise`<[`HypercertMinter`](HypercertMinter.md)\>

#### Returns

`Promise`<[`HypercertMinter`](HypercertMinter.md)\>

#### Overrides

BaseContract.deployed

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:357

---

### emit

▸ **emit**(`eventName`, `...args`): `boolean`

#### Parameters

| Name        | Type                      |
| :---------- | :------------------------ |
| `eventName` | `string` \| `EventFilter` |
| `...args`   | `any`[]                   |

#### Returns

`boolean`

#### Inherited from

BaseContract.emit

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:127

---

### fallback

▸ **fallback**(`overrides?`): `Promise`<`TransactionResponse`\>

#### Parameters

| Name         | Type                 |
| :----------- | :------------------- |
| `overrides?` | `TransactionRequest` |

#### Returns

`Promise`<`TransactionResponse`\>

#### Inherited from

BaseContract.fallback

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:115

---

### hasBeenClaimed

▸ **hasBeenClaimed**(`arg0`, `arg1`, `overrides?`): `Promise`<`boolean`\>

#### Parameters

| Name         | Type                              |
| :----------- | :-------------------------------- |
| `arg0`       | `PromiseOrValue`<`BigNumberish`\> |
| `arg1`       | `PromiseOrValue`<`BytesLike`\>    |
| `overrides?` | `CallOverrides`                   |

#### Returns

`Promise`<`boolean`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:478

---

### initialize

▸ **initialize**(`overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:479

---

### isAllowedToClaim

▸ **isAllowedToClaim**(`proof`, `claimID`, `leaf`, `overrides?`): `Promise`<`boolean`\>

#### Parameters

| Name         | Type                              |
| :----------- | :-------------------------------- |
| `proof`      | `PromiseOrValue`<`BytesLike`\>[]  |
| `claimID`    | `PromiseOrValue`<`BigNumberish`\> |
| `leaf`       | `PromiseOrValue`<`BytesLike`\>    |
| `overrides?` | `CallOverrides`                   |

#### Returns

`Promise`<`boolean`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:482

---

### isApprovedForAll

▸ **isApprovedForAll**(`account`, `operator`, `overrides?`): `Promise`<`boolean`\>

#### Parameters

| Name         | Type                        |
| :----------- | :-------------------------- |
| `account`    | `PromiseOrValue`<`string`\> |
| `operator`   | `PromiseOrValue`<`string`\> |
| `overrides?` | `CallOverrides`             |

#### Returns

`Promise`<`boolean`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:483

---

### listenerCount

▸ **listenerCount**(`eventName?`): `number`

#### Parameters

| Name         | Type                      |
| :----------- | :------------------------ |
| `eventName?` | `string` \| `EventFilter` |

#### Returns

`number`

#### Inherited from

BaseContract.listenerCount

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:128

---

### listeners

▸ **listeners**<`TEvent`\>(`eventFilter?`): `TypedListener`<`TEvent`\>[]

#### Type parameters

| Name     | Type                                          |
| :------- | :-------------------------------------------- |
| `TEvent` | extends `TypedEvent`<`any`, `any`, `TEvent`\> |

#### Parameters

| Name           | Type                          |
| :------------- | :---------------------------- |
| `eventFilter?` | `TypedEventFilter`<`TEvent`\> |

#### Returns

`TypedListener`<`TEvent`\>[]

#### Overrides

BaseContract.listeners

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:360

▸ **listeners**(`eventName?`): `Listener`[]

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `eventName?` | `string` |

#### Returns

`Listener`[]

#### Overrides

BaseContract.listeners

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:361

---

### mergeFractions

▸ **mergeFractions**(`_account`, `_fractionIDs`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name           | Type                                                   |
| :------------- | :----------------------------------------------------- |
| `_account`     | `PromiseOrValue`<`string`\>                            |
| `_fractionIDs` | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `overrides?`   | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:484

---

### mintClaim

▸ **mintClaim**(`account`, `units`, `_uri`, `restrictions`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name           | Type                                                   |
| :------------- | :----------------------------------------------------- |
| `account`      | `PromiseOrValue`<`string`\>                            |
| `units`        | `PromiseOrValue`<`BigNumberish`\>                      |
| `_uri`         | `PromiseOrValue`<`string`\>                            |
| `restrictions` | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?`   | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:487

---

### mintClaimFromAllowlist

▸ **mintClaimFromAllowlist**(`account`, `proof`, `claimID`, `units`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>                            |
| `proof`      | `PromiseOrValue`<`BytesLike`\>[]                       |
| `claimID`    | `PromiseOrValue`<`BigNumberish`\>                      |
| `units`      | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:490

---

### mintClaimWithFractions

▸ **mintClaimWithFractions**(`account`, `units`, `fractions`, `_uri`, `restrictions`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name           | Type                                                   |
| :------------- | :----------------------------------------------------- |
| `account`      | `PromiseOrValue`<`string`\>                            |
| `units`        | `PromiseOrValue`<`BigNumberish`\>                      |
| `fractions`    | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `_uri`         | `PromiseOrValue`<`string`\>                            |
| `restrictions` | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?`   | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:493

---

### name

▸ **name**(`overrides?`): `Promise`<`string`\>

#### Parameters

| Name         | Type            |
| :----------- | :-------------- |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`<`string`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:496

---

### owner

▸ **owner**(`overrides?`): `Promise`<`string`\>

#### Parameters

| Name         | Type            |
| :----------- | :-------------- |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`<`string`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:497

---

### ownerOf

▸ **ownerOf**(`tokenID`, `overrides?`): `Promise`<`string`\>

#### Parameters

| Name         | Type                              |
| :----------- | :-------------------------------- |
| `tokenID`    | `PromiseOrValue`<`BigNumberish`\> |
| `overrides?` | `CallOverrides`                   |

#### Returns

`Promise`<`string`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:498

---

### pause

▸ **pause**(`overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:499

---

### paused

▸ **paused**(`overrides?`): `Promise`<`boolean`\>

#### Parameters

| Name         | Type            |
| :----------- | :-------------- |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:502

---

### proxiableUUID

▸ **proxiableUUID**(`overrides?`): `Promise`<`string`\>

#### Parameters

| Name         | Type            |
| :----------- | :-------------- |
| `overrides?` | `CallOverrides` |

#### Returns

`Promise`<`string`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:503

---

### queryFilter

▸ **queryFilter**<`TEvent`\>(`event`, `fromBlockOrBlockhash?`, `toBlock?`): `Promise`<`TEvent`[]\>

#### Type parameters

| Name     | Type                                          |
| :------- | :-------------------------------------------- |
| `TEvent` | extends `TypedEvent`<`any`, `any`, `TEvent`\> |

#### Parameters

| Name                    | Type                          |
| :---------------------- | :---------------------------- |
| `event`                 | `TypedEventFilter`<`TEvent`\> |
| `fromBlockOrBlockhash?` | `string` \| `number`          |
| `toBlock?`              | `string` \| `number`          |

#### Returns

`Promise`<`TEvent`[]\>

#### Overrides

BaseContract.queryFilter

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:359

---

### readTransferRestriction

▸ **readTransferRestriction**(`tokenID`, `overrides?`): `Promise`<`string`\>

#### Parameters

| Name         | Type                              |
| :----------- | :-------------------------------- |
| `tokenID`    | `PromiseOrValue`<`BigNumberish`\> |
| `overrides?` | `CallOverrides`                   |

#### Returns

`Promise`<`string`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:504

---

### removeAllListeners

▸ **removeAllListeners**<`TEvent`\>(`eventFilter`): [`HypercertMinter`](HypercertMinter.md)

#### Type parameters

| Name     | Type                                          |
| :------- | :-------------------------------------------- |
| `TEvent` | extends `TypedEvent`<`any`, `any`, `TEvent`\> |

#### Parameters

| Name          | Type                          |
| :------------ | :---------------------------- |
| `eventFilter` | `TypedEventFilter`<`TEvent`\> |

#### Returns

[`HypercertMinter`](HypercertMinter.md)

#### Overrides

BaseContract.removeAllListeners

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:362

▸ **removeAllListeners**(`eventName?`): [`HypercertMinter`](HypercertMinter.md)

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `eventName?` | `string` |

#### Returns

[`HypercertMinter`](HypercertMinter.md)

#### Overrides

BaseContract.removeAllListeners

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:363

---

### renounceOwnership

▸ **renounceOwnership**(`overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:505

---

### safeBatchTransferFrom

▸ **safeBatchTransferFrom**(`from`, `to`, `ids`, `amounts`, `data`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `from`       | `PromiseOrValue`<`string`\>                            |
| `to`         | `PromiseOrValue`<`string`\>                            |
| `ids`        | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `amounts`    | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `data`       | `PromiseOrValue`<`BytesLike`\>                         |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:508

---

### safeTransferFrom

▸ **safeTransferFrom**(`from`, `to`, `id`, `amount`, `data`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `from`       | `PromiseOrValue`<`string`\>                            |
| `to`         | `PromiseOrValue`<`string`\>                            |
| `id`         | `PromiseOrValue`<`BigNumberish`\>                      |
| `amount`     | `PromiseOrValue`<`BigNumberish`\>                      |
| `data`       | `PromiseOrValue`<`BytesLike`\>                         |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:511

---

### setApprovalForAll

▸ **setApprovalForAll**(`operator`, `approved`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `operator`   | `PromiseOrValue`<`string`\>                            |
| `approved`   | `PromiseOrValue`<`boolean`\>                           |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:514

---

### splitFraction

▸ **splitFraction**(`_account`, `_tokenID`, `_newFractions`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name            | Type                                                   |
| :-------------- | :----------------------------------------------------- |
| `_account`      | `PromiseOrValue`<`string`\>                            |
| `_tokenID`      | `PromiseOrValue`<`BigNumberish`\>                      |
| `_newFractions` | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `overrides?`    | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:517

---

### supportsInterface

▸ **supportsInterface**(`interfaceId`, `overrides?`): `Promise`<`boolean`\>

#### Parameters

| Name          | Type                           |
| :------------ | :----------------------------- |
| `interfaceId` | `PromiseOrValue`<`BytesLike`\> |
| `overrides?`  | `CallOverrides`                |

#### Returns

`Promise`<`boolean`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:520

---

### transferOwnership

▸ **transferOwnership**(`newOwner`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `newOwner`   | `PromiseOrValue`<`string`\>                            |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:521

---

### unitsOf(address,uint256)

▸ **unitsOf(address,uint256)**(`account`, `tokenID`, `overrides?`): `Promise`<`BigNumber`\>

#### Parameters

| Name         | Type                              |
| :----------- | :-------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>       |
| `tokenID`    | `PromiseOrValue`<`BigNumberish`\> |
| `overrides?` | `CallOverrides`                   |

#### Returns

`Promise`<`BigNumber`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:524

---

### unitsOf(uint256)

▸ **unitsOf(uint256)**(`tokenID`, `overrides?`): `Promise`<`BigNumber`\>

#### Parameters

| Name         | Type                              |
| :----------- | :-------------------------------- |
| `tokenID`    | `PromiseOrValue`<`BigNumberish`\> |
| `overrides?` | `CallOverrides`                   |

#### Returns

`Promise`<`BigNumber`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:525

---

### unpause

▸ **unpause**(`overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:526

---

### upgradeTo

▸ **upgradeTo**(`newImplementation`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name                | Type                                                   |
| :------------------ | :----------------------------------------------------- |
| `newImplementation` | `PromiseOrValue`<`string`\>                            |
| `overrides?`        | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:529

---

### upgradeToAndCall

▸ **upgradeToAndCall**(`newImplementation`, `data`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name                | Type                                                          |
| :------------------ | :------------------------------------------------------------ |
| `newImplementation` | `PromiseOrValue`<`string`\>                                   |
| `data`              | `PromiseOrValue`<`BytesLike`\>                                |
| `overrides?`        | `PayableOverrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:532

---

### uri

▸ **uri**(`tokenID`, `overrides?`): `Promise`<`string`\>

#### Parameters

| Name         | Type                              |
| :----------- | :-------------------------------- |
| `tokenID`    | `PromiseOrValue`<`BigNumberish`\> |
| `overrides?` | `CallOverrides`                   |

#### Returns

`Promise`<`string`\>

#### Defined in

contracts/dist/typechain/src/HypercertMinter.d.ts:535
