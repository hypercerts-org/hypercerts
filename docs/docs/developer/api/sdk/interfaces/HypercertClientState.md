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

### indexer

• **indexer**: `HypercertIndexer`

The indexer used by the client.

#### Defined in

[sdk/src/types/client.ts:172](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L172)

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Defined in

[sdk/src/types/client.ts:168](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L168)

---

### storage

• **storage**: [`HypercertStorageInterface`](HypercertStorageInterface.md)

The storage layer used by the client.

#### Defined in

[sdk/src/types/client.ts:170](https://github.com/hypercerts-org/hypercerts/blob/473cc51/sdk/src/types/client.ts#L170)
