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
  'query FractionsByOwner($owner: String = "", $first: Int = 100, $offset: Int = 0) {\n  fractions(\n    where: {owner_address: {eq: $owner}}\n    count: COUNT\n    first: $first\n    offset: $offset\n  ) {\n    count\n    data {\n      creation_block_timestamp\n      fraction_id\n      last_block_update_timestamp\n      owner_address\n      units\n    }\n  }\n}\n\nquery FractionsByHypercert($hypercertId: String!, $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    where: {hypercert_id: {eq: $hypercertId}}\n    first: $first\n    offset: $offset\n    sort: {by: {hypercert_id: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      units\n      uri\n      fractions {\n        count\n        data {\n          creation_block_timestamp\n          fraction_id\n          last_block_update_timestamp\n          owner_address\n          units\n        }\n      }\n    }\n  }\n}\n\nquery FractionById($fractionId: String!) {\n  fractions(where: {hypercert_id: {eq: $fractionId}}) {\n    data {\n      creation_block_timestamp\n      fraction_id\n      last_block_update_timestamp\n      owner_address\n      units\n    }\n  }\n}':
    types.FractionsByOwnerDocument,
  'query HypercertsByCreator($owner: String = "", $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    where: {creator_address: {eq: $owner}}\n    first: $first\n    offset: $offset\n    sort: {by: {hypercert_id: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}\n\nquery RecentHypercerts($orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    first: $first\n    offset: $offset\n    sort: {by: {block_number: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}\n\nquery HypercertById($id: String!) {\n  hypercerts(count: COUNT, where: {hypercert_id: {eq: $id}}) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}':
    types.HypercertsByCreatorDocument,
  'query MetadataByUri($uri: String = "", $first: Int = 100, $offset: Int = 0) {\n  metadata(where: {uri: {eq: $uri}}, first: $first, offset: $offset, count: COUNT) {\n    data {\n      allow_list_uri\n      contributors\n      description\n      external_url\n      image\n      impact_scope\n      impact_timeframe_from\n      impact_timeframe_to\n      name\n      properties\n      rights\n      uri\n      work_scope\n      work_timeframe_from\n      work_timeframe_to\n    }\n  }\n}\n\nquery MetadataForHypercert($hypercertId: String!, $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  metadata(\n    where: {hypercerts: {hypercert_id: {eq: $hypercertId}}}\n    first: $first\n    offset: $offset\n    count: COUNT\n  ) {\n    data {\n      allow_list_uri\n      contributors\n      description\n      external_url\n      image\n      impact_scope\n      impact_timeframe_from\n      impact_timeframe_to\n      name\n      properties\n      rights\n      uri\n      work_scope\n      work_timeframe_from\n      work_timeframe_to\n    }\n  }\n}':
    types.MetadataByUriDocument,
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
  source: 'query FractionsByOwner($owner: String = "", $first: Int = 100, $offset: Int = 0) {\n  fractions(\n    where: {owner_address: {eq: $owner}}\n    count: COUNT\n    first: $first\n    offset: $offset\n  ) {\n    count\n    data {\n      creation_block_timestamp\n      fraction_id\n      last_block_update_timestamp\n      owner_address\n      units\n    }\n  }\n}\n\nquery FractionsByHypercert($hypercertId: String!, $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    where: {hypercert_id: {eq: $hypercertId}}\n    first: $first\n    offset: $offset\n    sort: {by: {hypercert_id: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      units\n      uri\n      fractions {\n        count\n        data {\n          creation_block_timestamp\n          fraction_id\n          last_block_update_timestamp\n          owner_address\n          units\n        }\n      }\n    }\n  }\n}\n\nquery FractionById($fractionId: String!) {\n  fractions(where: {hypercert_id: {eq: $fractionId}}) {\n    data {\n      creation_block_timestamp\n      fraction_id\n      last_block_update_timestamp\n      owner_address\n      units\n    }\n  }\n}',
): (typeof documents)['query FractionsByOwner($owner: String = "", $first: Int = 100, $offset: Int = 0) {\n  fractions(\n    where: {owner_address: {eq: $owner}}\n    count: COUNT\n    first: $first\n    offset: $offset\n  ) {\n    count\n    data {\n      creation_block_timestamp\n      fraction_id\n      last_block_update_timestamp\n      owner_address\n      units\n    }\n  }\n}\n\nquery FractionsByHypercert($hypercertId: String!, $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    where: {hypercert_id: {eq: $hypercertId}}\n    first: $first\n    offset: $offset\n    sort: {by: {hypercert_id: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      units\n      uri\n      fractions {\n        count\n        data {\n          creation_block_timestamp\n          fraction_id\n          last_block_update_timestamp\n          owner_address\n          units\n        }\n      }\n    }\n  }\n}\n\nquery FractionById($fractionId: String!) {\n  fractions(where: {hypercert_id: {eq: $fractionId}}) {\n    data {\n      creation_block_timestamp\n      fraction_id\n      last_block_update_timestamp\n      owner_address\n      units\n    }\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query HypercertsByCreator($owner: String = "", $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    where: {creator_address: {eq: $owner}}\n    first: $first\n    offset: $offset\n    sort: {by: {hypercert_id: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}\n\nquery RecentHypercerts($orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    first: $first\n    offset: $offset\n    sort: {by: {block_number: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}\n\nquery HypercertById($id: String!) {\n  hypercerts(count: COUNT, where: {hypercert_id: {eq: $id}}) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}',
): (typeof documents)['query HypercertsByCreator($owner: String = "", $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    where: {creator_address: {eq: $owner}}\n    first: $first\n    offset: $offset\n    sort: {by: {hypercert_id: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}\n\nquery RecentHypercerts($orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  hypercerts(\n    count: COUNT\n    first: $first\n    offset: $offset\n    sort: {by: {block_number: $orderDirection}}\n  ) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}\n\nquery HypercertById($id: String!) {\n  hypercerts(count: COUNT, where: {hypercert_id: {eq: $id}}) {\n    count\n    data {\n      hypercert_id\n      creator_address\n      units\n      uri\n      contract {\n        chain_id\n      }\n    }\n  }\n}'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: 'query MetadataByUri($uri: String = "", $first: Int = 100, $offset: Int = 0) {\n  metadata(where: {uri: {eq: $uri}}, first: $first, offset: $offset, count: COUNT) {\n    data {\n      allow_list_uri\n      contributors\n      description\n      external_url\n      image\n      impact_scope\n      impact_timeframe_from\n      impact_timeframe_to\n      name\n      properties\n      rights\n      uri\n      work_scope\n      work_timeframe_from\n      work_timeframe_to\n    }\n  }\n}\n\nquery MetadataForHypercert($hypercertId: String!, $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  metadata(\n    where: {hypercerts: {hypercert_id: {eq: $hypercertId}}}\n    first: $first\n    offset: $offset\n    count: COUNT\n  ) {\n    data {\n      allow_list_uri\n      contributors\n      description\n      external_url\n      image\n      impact_scope\n      impact_timeframe_from\n      impact_timeframe_to\n      name\n      properties\n      rights\n      uri\n      work_scope\n      work_timeframe_from\n      work_timeframe_to\n    }\n  }\n}',
): (typeof documents)['query MetadataByUri($uri: String = "", $first: Int = 100, $offset: Int = 0) {\n  metadata(where: {uri: {eq: $uri}}, first: $first, offset: $offset, count: COUNT) {\n    data {\n      allow_list_uri\n      contributors\n      description\n      external_url\n      image\n      impact_scope\n      impact_timeframe_from\n      impact_timeframe_to\n      name\n      properties\n      rights\n      uri\n      work_scope\n      work_timeframe_from\n      work_timeframe_to\n    }\n  }\n}\n\nquery MetadataForHypercert($hypercertId: String!, $orderDirection: SortOrder = descending, $first: Int = 100, $offset: Int = 0) {\n  metadata(\n    where: {hypercerts: {hypercert_id: {eq: $hypercertId}}}\n    first: $first\n    offset: $offset\n    count: COUNT\n  ) {\n    data {\n      allow_list_uri\n      contributors\n      description\n      external_url\n      image\n      impact_scope\n      impact_timeframe_from\n      impact_timeframe_to\n      name\n      properties\n      rights\n      uri\n      work_scope\n      work_timeframe_from\n      work_timeframe_to\n    }\n  }\n}'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
