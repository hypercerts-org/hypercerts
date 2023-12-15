/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  'query ClaimsByOwner($owner: Bytes = "", $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claims(\n    where: {owner: $owner}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}\n\nquery RecentClaims($orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claims(orderDirection: $orderDirection, orderBy: creation, first: $first) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}\n\nquery ClaimById($id: ID!) {\n  claim(id: $id) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}':
    types.ClaimsByOwnerDocument,
  'query ClaimTokensByOwner($owner: Bytes = "", $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claimTokens(\n    where: {owner: $owner}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    id\n    owner\n    tokenID\n    units\n    claim {\n      id\n      creation\n      uri\n      totalUnits\n    }\n  }\n}\n\nquery ClaimTokensByClaim($claimId: String!, $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claimTokens(\n    where: {claim: $claimId}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    id\n    owner\n    tokenID\n    units\n  }\n}\n\nquery ClaimTokenById($claimTokenId: ID!) {\n  claimToken(id: $claimTokenId) {\n    id\n    owner\n    tokenID\n    units\n    claim {\n      id\n      creation\n      uri\n      totalUnits\n    }\n  }\n}':
    types.ClaimTokensByOwnerDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query ClaimsByOwner($owner: Bytes = "", $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claims(\n    where: {owner: $owner}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}\n\nquery RecentClaims($orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claims(orderDirection: $orderDirection, orderBy: creation, first: $first) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}\n\nquery ClaimById($id: ID!) {\n  claim(id: $id) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}',
): (typeof documents)['query ClaimsByOwner($owner: Bytes = "", $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claims(\n    where: {owner: $owner}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}\n\nquery RecentClaims($orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claims(orderDirection: $orderDirection, orderBy: creation, first: $first) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}\n\nquery ClaimById($id: ID!) {\n  claim(id: $id) {\n    contract\n    tokenID\n    creator\n    id\n    owner\n    totalUnits\n    uri\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query ClaimTokensByOwner($owner: Bytes = "", $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claimTokens(\n    where: {owner: $owner}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    id\n    owner\n    tokenID\n    units\n    claim {\n      id\n      creation\n      uri\n      totalUnits\n    }\n  }\n}\n\nquery ClaimTokensByClaim($claimId: String!, $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claimTokens(\n    where: {claim: $claimId}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    id\n    owner\n    tokenID\n    units\n  }\n}\n\nquery ClaimTokenById($claimTokenId: ID!) {\n  claimToken(id: $claimTokenId) {\n    id\n    owner\n    tokenID\n    units\n    claim {\n      id\n      creation\n      uri\n      totalUnits\n    }\n  }\n}',
): (typeof documents)['query ClaimTokensByOwner($owner: Bytes = "", $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claimTokens(\n    where: {owner: $owner}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    id\n    owner\n    tokenID\n    units\n    claim {\n      id\n      creation\n      uri\n      totalUnits\n    }\n  }\n}\n\nquery ClaimTokensByClaim($claimId: String!, $orderDirection: OrderDirection, $first: Int, $skip: Int) {\n  claimTokens(\n    where: {claim: $claimId}\n    skip: $skip\n    first: $first\n    orderDirection: $orderDirection\n  ) {\n    id\n    owner\n    tokenID\n    units\n  }\n}\n\nquery ClaimTokenById($claimTokenId: ID!) {\n  claimToken(id: $claimTokenId) {\n    id\n    owner\n    tokenID\n    units\n    claim {\n      id\n      creation\n      uri\n      totalUnits\n    }\n  }\n}'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
