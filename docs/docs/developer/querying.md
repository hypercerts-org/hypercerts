# Querying

For indexing purposes, we rely on the Graph to index Hypercert Events. To make the subgraph easily accessible with typed methods and object we use the [Graph Client](https://github.com/graphprotocol/graph-client) and it's SDK.

## Live graph playground

To inspect the Graph and explore queries and the data it exposes have a look at the Graph playground for Goerli testnet and Optimism mainnet:

[Goerli dashboard](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-testnet)
[Optimism dashboard](https://thegraph.com/hosted-service/subgraph/hypercerts-admin/hypercerts-optimism-mainnet)

## Graph client

Since the client is fully typed, it's easy to explore the functionalities using code completion in IDEs.

Here's one example from our frontend where we let [react-query](https://www.npmjs.com/package/%2540tanstack/react-query) frequently update the call to the graph:

```js
import { useHypercertClient } from "./hypercerts-client";
import { useQuery } from "@tanstack/react-query";

export const useFractionsByOwner = (owner: string) => {
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

## Queries: Claims

These tables show the input parameters and output fields for each of the GraphQL queries in [claims.graphql](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/indexer/queries/claims.graphql).

### `ClaimsByOwner`

The `ClaimsByOwner` query retrieves an array of claims that belong to a specific owner.

#### Input

The query takes the following input parameters:

| Parameter        | Type             | Description                                        | Default Value |
| ---------------- | ---------------- | -------------------------------------------------- | ------------- |
| `owner`          | `Bytes`          | The address of the owner whose claims to retrieve. | ""            |
| `orderDirection` | `OrderDirection` | The direction to order the claims.                 | `asc`         |
| `first`          | `Int`            | The number of claims to retrieve.                  | `100`         |
| `skip`           | `Int`            | The number of claims to skip.                      | `0`           |

#### Output

The query returns an array of claim objects that match the input parameters. Each claim object has the following fields:

| Field        | Type     | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `chainName`  | `String` | The name of the chain the claim was minted on. |
| `contract`   | `Bytes`  | The address of the contract.                   |
| `tokenID`    | `String` | The token ID.                                  |
| `creator`    | `Bytes`  | The address of the creator.                    |
| `id`         | `ID`     | The ID of the claim.                           |
| `owner`      | `Bytes`  | The address of the owner.                      |
| `totalUnits` | `BigInt` | The total number of units.                     |
| `uri`        | `String` | The URI of the claim metadata.                 |

### `RecentClaims`

The RecentClaims query retrieves an array of the most recent claims on the Hypercert platform.

#### Input

The query takes the following input parameters:

| Parameter        | Type             | Description                        | Default Value |
| ---------------- | ---------------- | ---------------------------------- | ------------- |
| `orderDirection` | `OrderDirection` | The direction to order the claims. | `asc`         |
| `first`          | `Int`            | The number of claims to retrieve.  | `100`         |
| `skip`           | `Int`            | The number of claims to skip.      | `0`           |

#### Output

The query returns an array of claim objects that match the input parameters. Each claim object has the following fields:

| Field        | Type     | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `chainName`  | `String` | The name of the chain the claim was minted on. |
| `contract`   | `Bytes`  | The address of the contract.                   |
| `tokenID`    | `String` | The token ID.                                  |
| `creator`    | `Bytes`  | The address of the creator.                    |
| `id`         | `ID`     | The ID of the claim.                           |
| `owner`      | `Bytes`  | The address of the owner.                      |
| `totalUnits` | `BigInt` | The total number of units.                     |
| `uri`        | `String` | The URI of the claim metadata.                 |

### `ClaimByID`

The ClaimById query retrieves a single claim by its ID on the Hypercert platform.

#### Input

The query takes the following input parameters:

| Parameter | Type  | Description                      |
| --------- | ----- | -------------------------------- |
| `id`      | `ID!` | The ID of the claim to retrieve. |

#### Output

The query returns a claim object that matches the input parameter. The claim object has the following fields:

| Field        | Type     | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `chainName`  | `String` | The name of the chain the claim was minted on. |
| `contract`   | `Bytes`  | The address of the contract.                   |
| `tokenID`    | `String` | The token ID.                                  |
| `creator`    | `Bytes`  | The address of the creator.                    |
| `id`         | `ID`     | The ID of the claim.                           |
| `owner`      | `Bytes`  | The address of the owner.                      |
| `totalUnits` | `BigInt` | The total number of units.                     |
| `uri`        | `String` | The URI of the claim metadata.                 |

## Queries: Fractions

These tables show the input parameters and output fields for each of the GraphQL queries in [fractions.graphql](https://github.com/hypercerts-org/hypercerts/blob/main/sdk/src/indexer/queries/fractions.graphql).

### `ClaimTokensByOwner`

The `ClaimTokensByOwner` query retrieves an array of claim tokens that belong to a specific owner on the Hypercert platform.

#### Input

The query takes the following input parameters:

| Parameter        | Type             | Description                                                          | Default Value |
| ---------------- | ---------------- | -------------------------------------------------------------------- | ------------- |
| `owner`          | `Bytes`          | The address of the owner whose claim tokens to retrieve.             | ""            |
| `orderDirection` | `OrderDirection` | The direction to order the claim tokens. The default value is `asc`. | `asc`         |
| `first`          | `Int`            | The number of claim tokens to retrieve. The default value is `100`.  | `100`         |
| `skip`           | `Int`            | The number of claim tokens to skip. The default value is `0`.        | `0`           |

#### Output

The query returns an array of claim token objects that match the input parameters. Each claim token object has the following fields:

| Field       | Type     | Description                                |
| ----------- | -------- | ------------------------------------------ |
| `chainName` | `String` | The name of the chain.                     |
| `id`        | `ID`     | The ID of the claim token.                 |
| `owner`     | `Bytes`  | The address of the owner.                  |
| `tokenID`   | `String` | The token ID.                              |
| `units`     | `BigInt` | The number of units.                       |
| `claim`     | `Claim`  | The claim associated with the claim token. |

The Claim object has the following fields:

| Field        | Type     | Description                          |
| ------------ | -------- | ------------------------------------ |
| `id`         | `ID`     | The ID of the claim.                 |
| `creation`   | `Int`    | The timestamp of the claim creation. |
| `uri`        | `String` | The URI of the claim metadata.       |
| `totalUnits` | `BigInt` | The total number of units.           |

### `ClaimTokensByClaim`

The `ClaimTokensByClaim` query retrieves an array of claim tokens that belong to a specific claim on the Hypercert platform.

#### Input

The query takes the following input parameters:

| Parameter        | Type             | Description                                                          | Default Value |
| ---------------- | ---------------- | -------------------------------------------------------------------- | ------------- |
| `claimId`        | `String!`        | The ID of the claim whose claim tokens to retrieve.                  | None          |
| `orderDirection` | `OrderDirection` | The direction to order the claim tokens. The default value is `asc`. | `asc`         |
| `first`          | `Int`            | The number of claim tokens to retrieve. The default value is `100`.  | `100`         |
| `skip`           | `Int`            | The number of claim tokens to skip. The default value is `0`.        | `0`           |

### Output

The query returns an array of claim token objects that match the input parameters. Each claim token object has the following fields:

| Field       | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `chainName` | `String` | The name of the chain the claim was minted on. |
| `id`        | `ID`     | The ID of the claim token.                     |
| `owner`     | `Bytes`  | The address of the owner.                      |
| `tokenID`   | `String` | The token ID.                                  |
| `units`     | `BigInt` | The number of units.                           |

### `ClaimTokenById` Query

The `ClaimTokenById` query retrieves a single claim token by its ID on the Hypercert platform.

#### Input

The query takes the following input parameters:

| Parameter | Type  | Description                            |
| --------- | ----- | -------------------------------------- |
| `id`      | `ID!` | The ID of the claim token to retrieve. |

#### Output

The query returns a claim token object that matches the input parameter. The claim token object has the following fields:

| Field       | Type     | Description                                    |
| ----------- | -------- | ---------------------------------------------- |
| `chainName` | `String` | The name of the chain the claim was minted on. |
| `id`        | `ID`     | The ID of the claim token.                     |
| `owner`     | `Bytes`  | The address of the owner.                      |
| `tokenID`   | `String` | The token ID.                                  |
| `units`     | `BigInt` | The number of units.                           |
| `claim`     | `Claim`  | The claim associated with the claim token.     |

The Claim object has the following fields:

| Field        | Type     | Description                          |
| ------------ | -------- | ------------------------------------ |
| `id`         | `ID`     | The ID of the claim.                 |
| `creation`   | `Int`    | The timestamp of the claim creation. |
| `uri`        | `String` | The URI of the claim metadata.       |
| `totalUnits` | `BigInt` | The total number of units.           |
