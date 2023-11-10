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

• **contract**: `Object`

#### Type declaration

| Name       | Type             |
| :--------- | :--------------- |
| `abi`      | `Abi`            |
| `address?` | \`0x$\{string}\` |

#### Defined in

sdk/src/types/client.ts:132

---

### indexer

• **indexer**: [`default`](../classes/internal.default-1.md)

The indexer used by the client.

#### Defined in

sdk/src/types/client.ts:131

---

### readonly

• **readonly**: `boolean`

Whether the client is in read-only mode.

#### Defined in

sdk/src/types/client.ts:127

---

### storage

• **storage**: [`HypercertStorageInterface`](HypercertStorageInterface.md)

The storage layer used by the client.

#### Defined in

sdk/src/types/client.ts:129
