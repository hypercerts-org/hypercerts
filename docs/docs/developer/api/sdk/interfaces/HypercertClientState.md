[Hypercerts SDK Documentation](../README.md) / [Exports](../modules.md) / HypercertClientState

# Interface: HypercertClientState

The state of the Hypercert client.

## Hierarchy

- **`HypercertClientState`**

  ↳ [`HypercertClientInterface`](HypercertClientInterface.md)

## Table of contents

### Properties

- [contract](HypercertClientState.md#contract)
- [indexer](HypercertClientState.md#indexer)
- [readonly](HypercertClientState.md#readonly)
- [storage](HypercertClientState.md#storage)

## Properties

### contract

• **contract**: [`HypercertMinter`](HypercertMinter.md)

The contract used by the client.

#### Defined in

[sdk/src/types/client.ts:117](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L117)

---

### indexer

• **indexer**: `default`

The indexer used by the client.

#### Defined in

[sdk/src/types/client.ts:115](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L115)

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Defined in

[sdk/src/types/client.ts:111](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L111)

---

### storage

• **storage**: [`HypercertStorageInterface`](HypercertStorageInterface.md)

The storage layer used by the client.

#### Defined in

[sdk/src/types/client.ts:113](https://github.com/Network-Goods/hypercerts/blob/fceb7f4/sdk/src/types/client.ts#L113)
