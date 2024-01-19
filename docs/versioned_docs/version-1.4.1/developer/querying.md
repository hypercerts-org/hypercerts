# Querying

## Overview

The `HypercertClient` provides a high-level interface for interacting with the Hypercert ecosystem. The HypercertClient
has three getter methods: `storage`, `indexer`, and `contract`. These methods return instances of the HypercertsStorage,
HypercertIndexer, and HypercertMinter classes, respectively.

```js
const {
  client: { storage },
} = new HypercertClient({ chain: { id: 11155111 } });
```

The `storage` is a utility class that provides methods for storing and retrieving Hypercert metadata off-chain on IPFS. It is used by the HypercertClient to store metadata when creating new Hypercerts.

```js
const {
  client: { indexer },
} = new HypercertClient({ chain: { id: 11155111 } });
```

The `indexer` is a utility class that provides methods for indexing and searching Hypercerts based on various criteria.
It is used by the HypercertClient to retrieve event-based data via the subgraph.

```js
const {
  client: { contract },
} = new HypercertClient({ chain: { id: 11155111 } });
```

Finally we have a `contract` that provides methods for interacting with the HypercertMinter smart contract. It is used
by the HypercertClient to create new Hypercerts and retrieve specific on-chain information.

By providing instances of these classes through the `storage`, `indexer`, and `contract` getters, the HypercertClient allows developers to easily interact with the various components of the Hypercert system directly.
For example, a developer could use the storage instance to store metadata for a new Hypercert, the indexer instance to search for existing Hypercerts based on various criteria, and the contract instance to create new Hypercerts and retrieve existing Hypercerts from the contract.

## Indexer

For indexing purposes, we rely on the [Graph](https://thegraph.com/docs/en/) to index Hypercert events. To make the subgraph easily accessible with typed methods and object we provide a client that wraps [urql](https://formidable.com/open-source/urql/) into an opiniated set of queries.

### Live graph playground

To inspect the subgraph and explore queries, have a look at the Graph playground for Goerli testnet and Optimism mainnet:

- [Goerli dashboard](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-testnet)
- [Optimism dashboard](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-optimism-mainnet)

### Graph client

Since the client is fully typed, it's easy to explore the functionalities using code completion in IDEs.

Here's one example from our frontend where we let [react-query](https://www.npmjs.com/package/%2540tanstack/react-query) frequently update the call to the graph:

```js
import { useHypercertClient } from "./hypercerts-client";
import { useQuery } from "@tanstack/react-query";

export const useFractionsByOwner = (owner: `0x${string}`) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  return useQuery(
    ["hypercerts", "fractions", "owner", owner],
    () => indexer.fractionsByOwner(owner),
    { enabled: !!owner, refetchInterval: 5000 },
  );
};
```

### Queries: Claims

These tables show the input parameters and output fields for each of the GraphQL queries in [claims.graphql](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/indexer/queries/claims.graphql).
A claim represents 1 Hypercert and all of the common data across all claim/fraction tokens.

#### `ClaimsByOwner`

The `ClaimsByOwner` query retrieves an array of claims that belong to a specific owner.

##### Input

The query takes the following input parameters:

| Parameter        | Type             | Description                                        | Default Value |
| ---------------- | ---------------- | -------------------------------------------------- | ------------- |
| `owner`          | `Bytes`          | The address of the owner whose claims to retrieve. | ""            |
| `orderDirection` | `OrderDirection` | The direction to order the claims.                 | `asc`         |
| `first`          | `Int`            | The number of claims to retrieve.                  | `100`         |
| `skip`           | `Int`            | The number of claims to skip.                      | `0`           |

##### Output

The query returns an array of claim objects that match the input parameters. Each claim object has the following fields:

| Field        | Type     | Description                    |
| ------------ | -------- | ------------------------------ |
| `contract`   | `Bytes`  | The address of the contract.   |
| `tokenID`    | `String` | The token ID.                  |
| `creator`    | `Bytes`  | The address of the creator.    |
| `id`         | `ID`     | The ID of the claim.           |
| `owner`      | `Bytes`  | The address of the owner.      |
| `totalUnits` | `BigInt` | The total number of units.     |
| `uri`        | `String` | The URI of the claim metadata. |

#### `RecentClaims`

The RecentClaims query retrieves an array of the most recent claims on the Hypercert platform.

##### Input

The query takes the following input parameters:

| Parameter        | Type             | Description                        | Default Value |
| ---------------- | ---------------- | ---------------------------------- | ------------- |
| `orderDirection` | `OrderDirection` | The direction to order the claims. | `asc`         |
| `first`          | `Int`            | The number of claims to retrieve.  | `100`         |
| `skip`           | `Int`            | The number of claims to skip.      | `0`           |

##### Output

The query returns an array of claim objects that match the input parameters. Each claim object has the following fields:

| Field        | Type     | Description                    |
| ------------ | -------- | ------------------------------ |
| `contract`   | `Bytes`  | The address of the contract.   |
| `tokenID`    | `String` | The token ID.                  |
| `creator`    | `Bytes`  | The address of the creator.    |
| `id`         | `ID`     | The ID of the claim.           |
| `owner`      | `Bytes`  | The address of the owner.      |
| `totalUnits` | `BigInt` | The total number of units.     |
| `uri`        | `String` | The URI of the claim metadata. |

#### `ClaimByID`

The ClaimById query retrieves a single claim by its ID on the Hypercert platform.

##### Input

The query takes the following input parameters:

| Parameter | Type  | Description                      |
| --------- | ----- | -------------------------------- |
| `id`      | `ID!` | The ID of the claim to retrieve. |

##### Output

The query returns a claim object that matches the input parameter. The claim object has the following fields:

| Field        | Type     | Description                    |
| ------------ | -------- | ------------------------------ |
| `contract`   | `Bytes`  | The address of the contract.   |
| `tokenID`    | `String` | The token ID.                  |
| `creator`    | `Bytes`  | The address of the creator.    |
| `id`         | `ID`     | The ID of the claim.           |
| `owner`      | `Bytes`  | The address of the owner.      |
| `totalUnits` | `BigInt` | The total number of units.     |
| `uri`        | `String` | The URI of the claim metadata. |

### Queries: Fractions

These tables show the input parameters and output fields for each of the GraphQL queries in [fractions.graphql](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/indexer/queries/fractions.graphql).
A claim token represents a fraction of ownership of a Hypercert.

#### `ClaimTokensByOwner`

The `ClaimTokensByOwner` query retrieves an array of claim tokens that belong to a specific owner on the Hypercert platform.

##### Input

The query takes the following input parameters:

| Parameter        | Type             | Description                                                          | Default Value |
| ---------------- | ---------------- | -------------------------------------------------------------------- | ------------- |
| `owner`          | `Bytes`          | The address of the owner whose claim tokens to retrieve.             | ""            |
| `orderDirection` | `OrderDirection` | The direction to order the claim tokens. The default value is `asc`. | `asc`         |
| `first`          | `Int`            | The number of claim tokens to retrieve. The default value is `100`.  | `100`         |
| `skip`           | `Int`            | The number of claim tokens to skip. The default value is `0`.        | `0`           |

##### Output

The query returns an array of claim token objects that match the input parameters. Each claim token object has the following fields:

| Field     | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `id`      | `ID`     | The ID of the claim token.                 |
| `owner`   | `Bytes`  | The address of the owner.                  |
| `tokenID` | `String` | The token ID.                              |
| `units`   | `BigInt` | The number of units.                       |
| `claim`   | `Claim`  | The claim associated with the claim token. |

The Claim object has the following fields:

| Field        | Type     | Description                          |
| ------------ | -------- | ------------------------------------ |
| `id`         | `ID`     | The ID of the claim.                 |
| `creation`   | `Int`    | The timestamp of the claim creation. |
| `uri`        | `String` | The URI of the claim metadata.       |
| `totalUnits` | `BigInt` | The total number of units.           |

#### `ClaimTokensByClaim`

The `ClaimTokensByClaim` query retrieves an array of claim tokens that belong to a specific claim on the Hypercert platform.

##### Input

The query takes the following input parameters:

| Parameter        | Type             | Description                                                          | Default Value |
| ---------------- | ---------------- | -------------------------------------------------------------------- | ------------- |
| `claimId`        | `String!`        | The ID of the claim whose claim tokens to retrieve.                  | None          |
| `orderDirection` | `OrderDirection` | The direction to order the claim tokens. The default value is `asc`. | `asc`         |
| `first`          | `Int`            | The number of claim tokens to retrieve. The default value is `100`.  | `100`         |
| `skip`           | `Int`            | The number of claim tokens to skip. The default value is `0`.        | `0`           |

##### Output

The query returns an array of claim token objects that match the input parameters. Each claim token object has the following fields:

| Field     | Type     | Description                |
| --------- | -------- | -------------------------- |
| `id`      | `ID`     | The ID of the claim token. |
| `owner`   | `Bytes`  | The address of the owner.  |
| `tokenID` | `String` | The token ID.              |
| `units`   | `BigInt` | The number of units.       |

#### `ClaimTokenById` Query

The `ClaimTokenById` query retrieves a single claim token by its ID on the Hypercert platform.

##### Input

The query takes the following input parameters:

| Parameter | Type  | Description                            |
| --------- | ----- | -------------------------------------- |
| `id`      | `ID!` | The ID of the claim token to retrieve. |

##### Output

The query returns a claim token object that matches the input parameter. The claim token object has the following fields:

| Field     | Type     | Description                                |
| --------- | -------- | ------------------------------------------ |
| `id`      | `ID`     | The ID of the claim token.                 |
| `owner`   | `Bytes`  | The address of the owner.                  |
| `tokenID` | `String` | The token ID.                              |
| `units`   | `BigInt` | The number of units.                       |
| `claim`   | `Claim`  | The claim associated with the claim token. |

The Claim object has the following fields:

| Field        | Type     | Description                          |
| ------------ | -------- | ------------------------------------ |
| `id`         | `ID`     | The ID of the claim.                 |
| `creation`   | `Int`    | The timestamp of the claim creation. |
| `uri`        | `String` | The URI of the claim metadata.       |
| `totalUnits` | `BigInt` | The total number of units.           |

## Storage

### Hypercert Metadata

Currently, all metadata is stored off-chain in IPFS. Use the `storage` client to retrieve the metadata

```js
const claimId = "0x822f17a9a5eecfd...85254363386255337";
const { indexer, storage } = hypercertsClient;
// Get the on-chain claim
const claimById = await indexer.claimById(claimId);
// Get the off-chain metadata
const metadata = await storage.getMetadata(claimById.claim.uri);
```
