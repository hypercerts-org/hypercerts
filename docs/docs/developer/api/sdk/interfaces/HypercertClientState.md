---
id: "HypercertClientState"
title: "Interface: HypercertClientState"
sidebar_label: "HypercertClientState"
sidebar_position: 0
custom_edit_url: null
---

The state of the Hypercert client.

## Hierarchy

- **`HypercertClientState`**

  ↳ [`HypercertClientInterface`](HypercertClientInterface.md)

## Properties

### contract

• **contract**: `GetContractReturnType`<(\{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name?`: `undefined` = "balanceOf"; `outputs?`: `undefined` ; `stateMutability`: `string` = "nonpayable"; `type`: `string` = "constructor" } \| \{ `anonymous?`: `undefined` = false; `inputs`: `never`[] = []; `name`: `string` = "AlreadyClaimed"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "error" } \| \{ `anonymous`: `boolean` = false; `inputs`: \{ `indexed`: `boolean` = false; `internalType`: `string` = "address"; `name`: `string` = "previousAdmin"; `type`: `string` = "address" }[] ; `name`: `string` = "AdminChanged"; `outputs?`: `undefined` ; `stateMutability?`: `undefined` = "view"; `type`: `string` = "event" } \| \{ `anonymous?`: `undefined` = false; `inputs`: \{ `internalType`: `string` = "address"; `name`: `string` = "account"; `type`: `string` = "address" }[] ; `name`: `string` = "balanceOf"; `outputs`: \{ `internalType`: `string` = "uint256"; `name`: `string` = ""; `type`: `string` = "uint256" }[] ; `stateMutability`: `string` = "view"; `type`: `string` = "function" })[]\>

#### Defined in

[sdk/src/types/client.ts:164](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/client.ts#L164)

---

### indexer

• **indexer**: `HypercertIndexer`

The indexer used by the client.

#### Defined in

[sdk/src/types/client.ts:163](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/client.ts#L163)

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Defined in

[sdk/src/types/client.ts:159](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/client.ts#L159)

---

### storage

• **storage**: [`HypercertStorageInterface`](HypercertStorageInterface.md)

The storage layer used by the client.

#### Defined in

[sdk/src/types/client.ts:161](https://github.com/hypercerts-org/hypercerts/blob/efdb2e8/sdk/src/types/client.ts#L161)
