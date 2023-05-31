[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / IHypercertToken

# Interface: IHypercertToken

## Hierarchy

- `BaseContract`

  ↳ **`IHypercertToken`**

## Table of contents

### Properties

- [\_deployedPromise](IHypercertToken.md#_deployedpromise)
- [\_runningEvents](IHypercertToken.md#_runningevents)
- [\_wrappedEmits](IHypercertToken.md#_wrappedemits)
- [address](IHypercertToken.md#address)
- [callStatic](IHypercertToken.md#callstatic)
- [deployTransaction](IHypercertToken.md#deploytransaction)
- [estimateGas](IHypercertToken.md#estimategas)
- [filters](IHypercertToken.md#filters)
- [functions](IHypercertToken.md#functions)
- [interface](IHypercertToken.md#interface)
- [off](IHypercertToken.md#off)
- [on](IHypercertToken.md#on)
- [once](IHypercertToken.md#once)
- [populateTransaction](IHypercertToken.md#populatetransaction)
- [provider](IHypercertToken.md#provider)
- [removeListener](IHypercertToken.md#removelistener)
- [resolvedAddress](IHypercertToken.md#resolvedaddress)
- [signer](IHypercertToken.md#signer)

### Methods

- [\_checkRunningEvents](IHypercertToken.md#_checkrunningevents)
- [\_deployed](IHypercertToken.md#_deployed)
- [\_wrapEvent](IHypercertToken.md#_wrapevent)
- [attach](IHypercertToken.md#attach)
- [burnFraction](IHypercertToken.md#burnfraction)
- [connect](IHypercertToken.md#connect)
- [deployed](IHypercertToken.md#deployed)
- [emit](IHypercertToken.md#emit)
- [fallback](IHypercertToken.md#fallback)
- [listenerCount](IHypercertToken.md#listenercount)
- [listeners](IHypercertToken.md#listeners)
- [mergeFractions](IHypercertToken.md#mergefractions)
- [mintClaim](IHypercertToken.md#mintclaim)
- [mintClaimWithFractions](IHypercertToken.md#mintclaimwithfractions)
- [queryFilter](IHypercertToken.md#queryfilter)
- [removeAllListeners](IHypercertToken.md#removealllisteners)
- [splitFraction](IHypercertToken.md#splitfraction)
- [unitsOf(address,uint256)](<IHypercertToken.md#unitsof(address,uint256)>)
- [unitsOf(uint256)](<IHypercertToken.md#unitsof(uint256)>)
- [uri](IHypercertToken.md#uri)

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

| Name                       | Type                                                                                                                                                                                                                                                                               |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `burnFraction`             | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                        |
| `mergeFractions`           | (`account`: `PromiseOrValue`<`string`\>, `tokenIDs`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                                                                     |
| `mintClaim`                | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                   |
| `mintClaimWithFractions`   | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `fractions`: `PromiseOrValue`<`BigNumberish`\>[], `uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`void`\> |
| `splitFraction`            | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `_values`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `CallOverrides`) => `Promise`<`void`\>                                                                                        |
| `unitsOf(address,uint256)` | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                   |
| `unitsOf(uint256)`         | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                           |
| `uri`                      | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`string`\>                                                                                                                                                                              |

#### Overrides

BaseContract.callStatic

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:122

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

| Name                       | Type                                                                                                                                                                                                                                                                                                                           |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `burnFraction`             | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                        |
| `mergeFractions`           | (`account`: `PromiseOrValue`<`string`\>, `tokenIDs`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                                                                     |
| `mintClaim`                | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                   |
| `mintClaimWithFractions`   | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `fractions`: `PromiseOrValue`<`BigNumberish`\>[], `uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\> |
| `splitFraction`            | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `_values`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`BigNumber`\>                                                                                        |
| `unitsOf(address,uint256)` | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                               |
| `unitsOf(uint256)`         | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                       |
| `uri`                      | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`BigNumber`\>                                                                                                                                                                                                                       |

#### Overrides

BaseContract.estimateGas

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:136

---

### filters

• **filters**: `Object`

#### Type declaration

| Name                                  | Type                                                                                                                         |
| :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------- |
| `ClaimStored`                         | (`claimID?`: `null` \| `PromiseOrValue`<`BigNumberish`\>, `uri?`: `null`, `totalUnits?`: `null`) => `ClaimStoredEventFilter` |
| `ClaimStored(uint256,string,uint256)` | (`claimID?`: `null` \| `PromiseOrValue`<`BigNumberish`\>, `uri?`: `null`, `totalUnits?`: `null`) => `ClaimStoredEventFilter` |

#### Overrides

BaseContract.filters

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:132

---

### functions

• **functions**: `Object`

#### Type declaration

| Name                       | Type                                                                                                                                                                                                                                                                                                                                     |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `burnFraction`             | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                        |
| `mergeFractions`           | (`account`: `PromiseOrValue`<`string`\>, `tokenIDs`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                                                                     |
| `mintClaim`                | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                   |
| `mintClaimWithFractions`   | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `fractions`: `PromiseOrValue`<`BigNumberish`\>[], `uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\> |
| `splitFraction`            | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `_values`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`ContractTransaction`\>                                                                                        |
| `unitsOf(address,uint256)` | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`] & { `units`: `BigNumber` }\>                                                                                                                                                            |
| `unitsOf(uint256)`         | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`BigNumber`] & { `units`: `BigNumber` }\>                                                                                                                                                                                                    |
| `uri`                      | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<[`string`] & { `metadata`: `string` }\>                                                                                                                                                                                                       |

#### Overrides

BaseContract.functions

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:78

---

### interface

• **interface**: `IHypercertTokenInterface`

#### Overrides

BaseContract.interface

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:68

---

### off

• **off**: `OnEvent`<[`IHypercertToken`](IHypercertToken.md)\>

#### Overrides

BaseContract.off

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:74

---

### on

• **on**: `OnEvent`<[`IHypercertToken`](IHypercertToken.md)\>

#### Overrides

BaseContract.on

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:75

---

### once

• **once**: `OnEvent`<[`IHypercertToken`](IHypercertToken.md)\>

#### Overrides

BaseContract.once

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:76

---

### populateTransaction

• **populateTransaction**: `Object`

#### Type declaration

| Name                       | Type                                                                                                                                                                                                                                                                                                                                      |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `burnFraction`             | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                        |
| `mergeFractions`           | (`account`: `PromiseOrValue`<`string`\>, `tokenIDs`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                                                                     |
| `mintClaim`                | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                   |
| `mintClaimWithFractions`   | (`account`: `PromiseOrValue`<`string`\>, `units`: `PromiseOrValue`<`BigNumberish`\>, `fractions`: `PromiseOrValue`<`BigNumberish`\>[], `uri`: `PromiseOrValue`<`string`\>, `restrictions`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\> |
| `splitFraction`            | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `_values`: `PromiseOrValue`<`BigNumberish`\>[], `overrides?`: `Overrides` & { `from?`: `PromiseOrValue`<`string`\> }) => `Promise`<`PopulatedTransaction`\>                                                                                        |
| `unitsOf(address,uint256)` | (`account`: `PromiseOrValue`<`string`\>, `tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                               |
| `unitsOf(uint256)`         | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                       |
| `uri`                      | (`tokenID`: `PromiseOrValue`<`BigNumberish`\>, `overrides?`: `CallOverrides`) => `Promise`<`PopulatedTransaction`\>                                                                                                                                                                                                                       |

#### Overrides

BaseContract.populateTransaction

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:156

---

### provider

• `Readonly` **provider**: `Provider`

#### Inherited from

BaseContract.provider

#### Defined in

node_modules/@ethersproject/contracts/lib/index.d.ts:82

---

### removeListener

• **removeListener**: `OnEvent`<[`IHypercertToken`](IHypercertToken.md)\>

#### Overrides

BaseContract.removeListener

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:77

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

▸ **attach**(`addressOrName`): [`IHypercertToken`](IHypercertToken.md)

#### Parameters

| Name            | Type     |
| :-------------- | :------- |
| `addressOrName` | `string` |

#### Returns

[`IHypercertToken`](IHypercertToken.md)

#### Overrides

BaseContract.attach

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:66

---

### burnFraction

▸ **burnFraction**(`account`, `tokenID`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>                            |
| `tokenID`    | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:104

---

### connect

▸ **connect**(`signerOrProvider`): [`IHypercertToken`](IHypercertToken.md)

#### Parameters

| Name               | Type                               |
| :----------------- | :--------------------------------- |
| `signerOrProvider` | `string` \| `Provider` \| `Signer` |

#### Returns

[`IHypercertToken`](IHypercertToken.md)

#### Overrides

BaseContract.connect

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:65

---

### deployed

▸ **deployed**(): `Promise`<[`IHypercertToken`](IHypercertToken.md)\>

#### Returns

`Promise`<[`IHypercertToken`](IHypercertToken.md)\>

#### Overrides

BaseContract.deployed

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:67

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

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:70

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

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:71

---

### mergeFractions

▸ **mergeFractions**(`account`, `tokenIDs`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>                            |
| `tokenIDs`   | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:107

---

### mintClaim

▸ **mintClaim**(`account`, `units`, `uri`, `restrictions`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name           | Type                                                   |
| :------------- | :----------------------------------------------------- |
| `account`      | `PromiseOrValue`<`string`\>                            |
| `units`        | `PromiseOrValue`<`BigNumberish`\>                      |
| `uri`          | `PromiseOrValue`<`string`\>                            |
| `restrictions` | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?`   | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:110

---

### mintClaimWithFractions

▸ **mintClaimWithFractions**(`account`, `units`, `fractions`, `uri`, `restrictions`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name           | Type                                                   |
| :------------- | :----------------------------------------------------- |
| `account`      | `PromiseOrValue`<`string`\>                            |
| `units`        | `PromiseOrValue`<`BigNumberish`\>                      |
| `fractions`    | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `uri`          | `PromiseOrValue`<`string`\>                            |
| `restrictions` | `PromiseOrValue`<`BigNumberish`\>                      |
| `overrides?`   | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:113

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

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:69

---

### removeAllListeners

▸ **removeAllListeners**<`TEvent`\>(`eventFilter`): [`IHypercertToken`](IHypercertToken.md)

#### Type parameters

| Name     | Type                                          |
| :------- | :-------------------------------------------- |
| `TEvent` | extends `TypedEvent`<`any`, `any`, `TEvent`\> |

#### Parameters

| Name          | Type                          |
| :------------ | :---------------------------- |
| `eventFilter` | `TypedEventFilter`<`TEvent`\> |

#### Returns

[`IHypercertToken`](IHypercertToken.md)

#### Overrides

BaseContract.removeAllListeners

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:72

▸ **removeAllListeners**(`eventName?`): [`IHypercertToken`](IHypercertToken.md)

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `eventName?` | `string` |

#### Returns

[`IHypercertToken`](IHypercertToken.md)

#### Overrides

BaseContract.removeAllListeners

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:73

---

### splitFraction

▸ **splitFraction**(`account`, `tokenID`, `_values`, `overrides?`): `Promise`<`ContractTransaction`\>

#### Parameters

| Name         | Type                                                   |
| :----------- | :----------------------------------------------------- |
| `account`    | `PromiseOrValue`<`string`\>                            |
| `tokenID`    | `PromiseOrValue`<`BigNumberish`\>                      |
| `_values`    | `PromiseOrValue`<`BigNumberish`\>[]                    |
| `overrides?` | `Overrides` & { `from?`: `PromiseOrValue`<`string`\> } |

#### Returns

`Promise`<`ContractTransaction`\>

#### Defined in

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:116

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

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:119

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

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:120

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

contracts/dist/typechain/src/interfaces/IHypercertToken.d.ts:121
