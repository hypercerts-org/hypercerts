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

• **contract**: [`HypercertMinter`](internal.HypercertMinter.md)

The contract used by the client.

#### Defined in

[sdk/src/types/client.ts:120](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L120)

---

### indexer

• **indexer**: [`default`](../classes/internal.default-1.md)

The indexer used by the client.

#### Defined in

[sdk/src/types/client.ts:118](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L118)

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Defined in

[sdk/src/types/client.ts:114](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L114)

---

### storage

• **storage**: [`HypercertStorageInterface`](HypercertStorageInterface.md)

The storage layer used by the client.

#### Defined in

[sdk/src/types/client.ts:116](https://github.com/Network-Goods/hypercerts/blob/9677274/sdk/src/types/client.ts#L116)
