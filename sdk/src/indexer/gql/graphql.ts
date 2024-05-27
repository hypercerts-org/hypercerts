/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any };
  /** Handles uint256 bigint values stored in DB */
  EthBigInt: { input: any; output: any };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
};

export type Attestation = {
  __typename?: "Attestation";
  attester?: Maybe<Scalars["String"]["output"]>;
  block_timestamp?: Maybe<Scalars["BigInt"]["output"]>;
  data?: Maybe<Scalars["JSON"]["output"]>;
  hypercerts?: Maybe<Array<Hypercert>>;
  id: Scalars["ID"]["output"];
  recipient?: Maybe<Scalars["String"]["output"]>;
  resolver?: Maybe<Scalars["String"]["output"]>;
  schema?: Maybe<Scalars["String"]["output"]>;
  supported_schemas_id?: Maybe<Scalars["ID"]["output"]>;
  uid?: Maybe<Scalars["ID"]["output"]>;
};

export type AttestationFetchInput = {
  by?: InputMaybe<AttestationSortOptions>;
};

export type AttestationSchema = {
  __typename?: "AttestationSchema";
  chain_id?: Maybe<Scalars["BigInt"]["output"]>;
  eas_schema_id?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  records?: Maybe<Array<Attestation>>;
  resolver?: Maybe<Scalars["String"]["output"]>;
  revocable?: Maybe<Scalars["Boolean"]["output"]>;
  schema?: Maybe<Scalars["String"]["output"]>;
};

export type AttestationSchemaFetchInput = {
  by?: InputMaybe<AttestationSchemaSortOptions>;
};

export type AttestationSchemaSortOptions = {
  chain_id?: InputMaybe<SortOrder>;
  eas_schema_id?: InputMaybe<SortOrder>;
  resolver?: InputMaybe<SortOrder>;
  revocable?: InputMaybe<SortOrder>;
};

export type AttestationSchemaWhereInput = {
  attestations?: InputMaybe<BasicAttestationSchemaWhereInput>;
  chain_id?: InputMaybe<NumberSearchOptions>;
  eas_schema_id?: InputMaybe<StringSearchOptions>;
  id?: InputMaybe<IdSearchOptions>;
  resolver?: InputMaybe<StringSearchOptions>;
  revocable?: InputMaybe<BooleanSearchOptions>;
  schema?: InputMaybe<StringSearchOptions>;
};

export type AttestationSortOptions = {
  attestation_uid?: InputMaybe<SortOrder>;
  attester_address?: InputMaybe<SortOrder>;
  block_timestamp?: InputMaybe<SortOrder>;
  recipient_address?: InputMaybe<SortOrder>;
  schema?: InputMaybe<SortOrder>;
};

export type AttestationWhereInput = {
  attestation?: InputMaybe<StringSearchOptions>;
  attestations?: InputMaybe<BasicAttestationWhereInput>;
  attester?: InputMaybe<StringSearchOptions>;
  block_timestamp?: InputMaybe<NumberSearchOptions>;
  chain_id?: InputMaybe<NumberSearchOptions>;
  contract_address?: InputMaybe<StringSearchOptions>;
  hypercerts?: InputMaybe<BasicHypercertWhereInput>;
  id?: InputMaybe<IdSearchOptions>;
  metadata?: InputMaybe<BasicMetadataWhereInput>;
  recipient?: InputMaybe<StringSearchOptions>;
  resolver?: InputMaybe<StringSearchOptions>;
  schema?: InputMaybe<StringSearchOptions>;
  supported_schemas_id?: InputMaybe<StringSearchOptions>;
  token_id?: InputMaybe<StringSearchOptions>;
  uid?: InputMaybe<StringSearchOptions>;
};

export type BasicAttestationSchemaWhereInput = {
  chain_id?: InputMaybe<NumberSearchOptions>;
  eas_schema_id?: InputMaybe<StringSearchOptions>;
  id?: InputMaybe<IdSearchOptions>;
  resolver?: InputMaybe<StringSearchOptions>;
  revocable?: InputMaybe<BooleanSearchOptions>;
  schema?: InputMaybe<StringSearchOptions>;
};

export type BasicAttestationWhereInput = {
  attestation?: InputMaybe<StringSearchOptions>;
  attester?: InputMaybe<StringSearchOptions>;
  block_timestamp?: InputMaybe<NumberSearchOptions>;
  chain_id?: InputMaybe<NumberSearchOptions>;
  contract_address?: InputMaybe<StringSearchOptions>;
  id?: InputMaybe<IdSearchOptions>;
  recipient?: InputMaybe<StringSearchOptions>;
  resolver?: InputMaybe<StringSearchOptions>;
  schema?: InputMaybe<StringSearchOptions>;
  supported_schemas_id?: InputMaybe<StringSearchOptions>;
  token_id?: InputMaybe<StringSearchOptions>;
  uid?: InputMaybe<StringSearchOptions>;
};

export type BasicContractWhereInput = {
  chain_id?: InputMaybe<NumberSearchOptions>;
  contract_address?: InputMaybe<StringSearchOptions>;
  id?: InputMaybe<IdSearchOptions>;
};

export type BasicFractionWhereInput = {
  creation_block_timestamp?: InputMaybe<NumberSearchOptions>;
  last_block_update_timestamp?: InputMaybe<NumberSearchOptions>;
  owner_address?: InputMaybe<StringSearchOptions>;
  token_id?: InputMaybe<NumberSearchOptions>;
  units?: InputMaybe<NumberSearchOptions>;
};

export type BasicHypercertWhereInput = {
  creation_block_timestamp?: InputMaybe<NumberSearchOptions>;
  hypercert_id?: InputMaybe<StringSearchOptions>;
  id?: InputMaybe<IdSearchOptions>;
  last_block_update_timestamp?: InputMaybe<NumberSearchOptions>;
  owner_address?: InputMaybe<StringSearchOptions>;
  token_id?: InputMaybe<NumberSearchOptions>;
  uri?: InputMaybe<StringSearchOptions>;
};

export type BasicMetadataWhereInput = {
  contributors?: InputMaybe<StringArraySearchOptions>;
  creation_block_timestamp?: InputMaybe<NumberSearchOptions>;
  description?: InputMaybe<StringSearchOptions>;
  impact_scope?: InputMaybe<StringArraySearchOptions>;
  impact_timeframe_from?: InputMaybe<NumberSearchOptions>;
  impact_timeframe_to?: InputMaybe<NumberSearchOptions>;
  last_block_update_timestamp?: InputMaybe<NumberSearchOptions>;
  name?: InputMaybe<StringSearchOptions>;
  rights?: InputMaybe<StringArraySearchOptions>;
  uri?: InputMaybe<StringSearchOptions>;
  work_scope?: InputMaybe<StringArraySearchOptions>;
  work_timeframe_from?: InputMaybe<NumberSearchOptions>;
  work_timeframe_to?: InputMaybe<NumberSearchOptions>;
};

export type BooleanSearchOptions = {
  eq?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type Contract = {
  __typename?: "Contract";
  chain_id?: Maybe<Scalars["BigInt"]["output"]>;
  contract_address?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  start_block?: Maybe<Scalars["BigInt"]["output"]>;
};

export type ContractFetchInput = {
  by?: InputMaybe<ContractSortOptions>;
};

export type ContractSortOptions = {
  chain_id?: InputMaybe<SortOrder>;
  contract_address?: InputMaybe<SortOrder>;
  contract_id?: InputMaybe<SortOrder>;
};

/** Count keys for the count query */
export enum CountKeys {
  /** Count the number of items in the query and return it along with the data */
  Count = "COUNT",
  /** Only get the count, not the data */
  Head = "HEAD",
}

export type Fraction = {
  __typename?: "Fraction";
  creation_block_timestamp?: Maybe<Scalars["BigInt"]["output"]>;
  hypercert_id?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  last_block_update_timestamp?: Maybe<Scalars["BigInt"]["output"]>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  units?: Maybe<Scalars["EthBigInt"]["output"]>;
};

export type FractionFetchInput = {
  by?: InputMaybe<FractionSortOptions>;
};

export type FractionSortOptions = {
  creation_block_timestamp?: InputMaybe<SortOrder>;
  last_block_update_timestamp?: InputMaybe<SortOrder>;
  owner_address?: InputMaybe<SortOrder>;
  token_id?: InputMaybe<SortOrder>;
  units?: InputMaybe<SortOrder>;
};

export type FractionWhereInput = {
  creation_block_timestamp?: InputMaybe<NumberSearchOptions>;
  hypercerts?: InputMaybe<BasicHypercertWhereInput>;
  last_block_update_timestamp?: InputMaybe<NumberSearchOptions>;
  owner_address?: InputMaybe<StringSearchOptions>;
  token_id?: InputMaybe<NumberSearchOptions>;
  units?: InputMaybe<NumberSearchOptions>;
};

export type GetAttestationsResponse = {
  __typename?: "GetAttestationsResponse";
  count?: Maybe<Scalars["Int"]["output"]>;
  data?: Maybe<Array<Attestation>>;
};

export type GetAttestationsSchemaResponse = {
  __typename?: "GetAttestationsSchemaResponse";
  count?: Maybe<Scalars["Int"]["output"]>;
  data: Array<AttestationSchema>;
};

export type GetContractsResponse = {
  __typename?: "GetContractsResponse";
  count?: Maybe<Scalars["Int"]["output"]>;
  data?: Maybe<Array<Contract>>;
};

export type GetFractionsResponse = {
  __typename?: "GetFractionsResponse";
  count?: Maybe<Scalars["Int"]["output"]>;
  data?: Maybe<Array<Fraction>>;
};

export type GetHypercertsResponse = {
  __typename?: "GetHypercertsResponse";
  count?: Maybe<Scalars["Int"]["output"]>;
  data?: Maybe<Array<Hypercert>>;
};

export type Hypercert = {
  __typename?: "Hypercert";
  attestations?: Maybe<GetAttestationsResponse>;
  contract?: Maybe<Contract>;
  contracts_id?: Maybe<Scalars["ID"]["output"]>;
  creation_block_timestamp?: Maybe<Scalars["BigInt"]["output"]>;
  fractions?: Maybe<GetFractionsResponse>;
  hypercert_id?: Maybe<Scalars["ID"]["output"]>;
  id: Scalars["ID"]["output"];
  last_block_update_timestamp?: Maybe<Scalars["BigInt"]["output"]>;
  metadata?: Maybe<Metadata>;
  owner_address?: Maybe<Scalars["String"]["output"]>;
  token_id?: Maybe<Scalars["EthBigInt"]["output"]>;
  units?: Maybe<Scalars["EthBigInt"]["output"]>;
  uri?: Maybe<Scalars["String"]["output"]>;
};

export type HypercertFetchInput = {
  by?: InputMaybe<HypercertSortOptions>;
};

export type HypercertSortOptions = {
  claim_attestation_count?: InputMaybe<SortOrder>;
  creation_block_timestamp?: InputMaybe<SortOrder>;
  hypercert_id?: InputMaybe<SortOrder>;
  last_block_update_timestamp?: InputMaybe<SortOrder>;
  owner_address?: InputMaybe<SortOrder>;
  token_id?: InputMaybe<SortOrder>;
  units?: InputMaybe<SortOrder>;
  uri?: InputMaybe<SortOrder>;
};

export type HypercertsWhereInput = {
  attestations?: InputMaybe<BasicAttestationWhereInput>;
  contract?: InputMaybe<BasicContractWhereInput>;
  creation_block_timestamp?: InputMaybe<NumberSearchOptions>;
  fractions?: InputMaybe<BasicFractionWhereInput>;
  hypercert_id?: InputMaybe<StringSearchOptions>;
  id?: InputMaybe<IdSearchOptions>;
  last_block_update_timestamp?: InputMaybe<NumberSearchOptions>;
  metadata?: InputMaybe<BasicMetadataWhereInput>;
  owner_address?: InputMaybe<StringSearchOptions>;
  token_id?: InputMaybe<NumberSearchOptions>;
  uri?: InputMaybe<StringSearchOptions>;
};

export type IdSearchOptions = {
  contains?: InputMaybe<Scalars["ID"]["input"]>;
  endsWith?: InputMaybe<Scalars["ID"]["input"]>;
  eq?: InputMaybe<Scalars["ID"]["input"]>;
  startsWith?: InputMaybe<Scalars["ID"]["input"]>;
};

export type Metadata = {
  __typename?: "Metadata";
  allow_list_uri?: Maybe<Scalars["String"]["output"]>;
  contributors?: Maybe<Array<Scalars["String"]["output"]>>;
  description?: Maybe<Scalars["String"]["output"]>;
  external_url?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  impact_scope?: Maybe<Array<Scalars["String"]["output"]>>;
  impact_timeframe_from?: Maybe<Scalars["BigInt"]["output"]>;
  impact_timeframe_to?: Maybe<Scalars["BigInt"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  properties?: Maybe<Scalars["JSON"]["output"]>;
  rights?: Maybe<Array<Scalars["String"]["output"]>>;
  uri?: Maybe<Scalars["String"]["output"]>;
  work_scope?: Maybe<Array<Scalars["String"]["output"]>>;
  work_timeframe_from?: Maybe<Scalars["BigInt"]["output"]>;
  work_timeframe_to?: Maybe<Scalars["BigInt"]["output"]>;
};

export type MetadataFetchInput = {
  by?: InputMaybe<MetadataSortOptions>;
};

export type MetadataSortOptions = {
  allow_list_uri?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  external_url?: InputMaybe<SortOrder>;
  metadata_id?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  uri?: InputMaybe<SortOrder>;
};

export type MetadataWhereInput = {
  creation_block_timestamp?: InputMaybe<NumberSearchOptions>;
  hypercert_id?: InputMaybe<StringSearchOptions>;
  id?: InputMaybe<IdSearchOptions>;
  last_block_update_timestamp?: InputMaybe<NumberSearchOptions>;
  metadata?: InputMaybe<BasicMetadataWhereInput>;
  owner_address?: InputMaybe<StringSearchOptions>;
  token_id?: InputMaybe<NumberSearchOptions>;
  uri?: InputMaybe<StringSearchOptions>;
};

export type NumberSearchOptions = {
  eq?: InputMaybe<Scalars["BigInt"]["input"]>;
  gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  lte?: InputMaybe<Scalars["BigInt"]["input"]>;
};

export type Query = {
  __typename?: "Query";
  attestationSchemas: GetAttestationsSchemaResponse;
  attestations: GetAttestationsResponse;
  contracts: GetContractsResponse;
  fractions: GetFractionsResponse;
  hypercerts: GetHypercertsResponse;
  metadata: Array<Metadata>;
};

export type QueryAttestationSchemasArgs = {
  count?: InputMaybe<CountKeys>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<AttestationSchemaFetchInput>;
  where?: InputMaybe<AttestationSchemaWhereInput>;
};

export type QueryAttestationsArgs = {
  count?: InputMaybe<CountKeys>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<AttestationFetchInput>;
  where?: InputMaybe<AttestationWhereInput>;
};

export type QueryContractsArgs = {
  count?: InputMaybe<CountKeys>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ContractFetchInput>;
  where?: InputMaybe<BasicContractWhereInput>;
};

export type QueryFractionsArgs = {
  count?: InputMaybe<CountKeys>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<FractionFetchInput>;
  where?: InputMaybe<FractionWhereInput>;
};

export type QueryHypercertsArgs = {
  count?: InputMaybe<CountKeys>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<HypercertFetchInput>;
  where?: InputMaybe<HypercertsWhereInput>;
};

export type QueryMetadataArgs = {
  count?: InputMaybe<CountKeys>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<MetadataFetchInput>;
  where?: InputMaybe<MetadataWhereInput>;
};

/** The direction to sort the query results */
export enum SortOrder {
  /** Ascending order */
  Ascending = "ascending",
  /** Descending order */
  Descending = "descending",
}

export type StringArraySearchOptions = {
  contains?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type StringSearchOptions = {
  contains?: InputMaybe<Scalars["String"]["input"]>;
  endsWith?: InputMaybe<Scalars["String"]["input"]>;
  eq?: InputMaybe<Scalars["String"]["input"]>;
  startsWith?: InputMaybe<Scalars["String"]["input"]>;
};

export type FractionsByOwnerQueryVariables = Exact<{
  owner?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type FractionsByOwnerQuery = {
  __typename?: "Query";
  fractions: {
    __typename?: "GetFractionsResponse";
    count?: number | null;
    data?: Array<{
      __typename?: "Fraction";
      creation_block_timestamp?: any | null;
      hypercert_id?: string | null;
      last_block_update_timestamp?: any | null;
      owner_address?: string | null;
      units?: any | null;
    }> | null;
  };
};

export type FractionsByHypercertQueryVariables = Exact<{
  hypercertId: Scalars["String"]["input"];
  orderDirection?: InputMaybe<SortOrder>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type FractionsByHypercertQuery = {
  __typename?: "Query";
  hypercerts: {
    __typename?: "GetHypercertsResponse";
    count?: number | null;
    data?: Array<{
      __typename?: "Hypercert";
      hypercert_id?: string | null;
      units?: any | null;
      uri?: string | null;
      fractions?: {
        __typename?: "GetFractionsResponse";
        count?: number | null;
        data?: Array<{
          __typename?: "Fraction";
          creation_block_timestamp?: any | null;
          hypercert_id?: string | null;
          last_block_update_timestamp?: any | null;
          owner_address?: string | null;
          units?: any | null;
        }> | null;
      } | null;
    }> | null;
  };
};

export type HypercertsByOwnerQueryVariables = Exact<{
  owner?: InputMaybe<Scalars["String"]["input"]>;
  orderDirection?: InputMaybe<SortOrder>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type HypercertsByOwnerQuery = {
  __typename?: "Query";
  hypercerts: {
    __typename?: "GetHypercertsResponse";
    count?: number | null;
    data?: Array<{
      __typename?: "Hypercert";
      hypercert_id?: string | null;
      owner_address?: string | null;
      units?: any | null;
      uri?: string | null;
      contract?: { __typename?: "Contract"; chain_id?: any | null } | null;
    }> | null;
  };
};

export type RecentHypercertsQueryVariables = Exact<{
  orderDirection?: InputMaybe<SortOrder>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  offset?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type RecentHypercertsQuery = {
  __typename?: "Query";
  hypercerts: {
    __typename?: "GetHypercertsResponse";
    count?: number | null;
    data?: Array<{
      __typename?: "Hypercert";
      hypercert_id?: string | null;
      owner_address?: string | null;
      units?: any | null;
      uri?: string | null;
      contract?: { __typename?: "Contract"; chain_id?: any | null } | null;
    }> | null;
  };
};

export type HypercertByIdQueryVariables = Exact<{
  id: Scalars["String"]["input"];
}>;

export type HypercertByIdQuery = {
  __typename?: "Query";
  hypercerts: {
    __typename?: "GetHypercertsResponse";
    count?: number | null;
    data?: Array<{
      __typename?: "Hypercert";
      hypercert_id?: string | null;
      owner_address?: string | null;
      units?: any | null;
      uri?: string | null;
      contract?: { __typename?: "Contract"; chain_id?: any | null } | null;
    }> | null;
  };
};

export const FractionsByOwnerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FractionsByOwner" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "owner" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          defaultValue: { kind: "StringValue", value: "", block: false },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "100" },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "fractions" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "owner_address" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "eq" },
                            value: { kind: "Variable", name: { kind: "Name", value: "owner" } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "count" },
                value: { kind: "EnumValue", value: "COUNT" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "count" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "creation_block_timestamp" } },
                      { kind: "Field", name: { kind: "Name", value: "hypercert_id" } },
                      { kind: "Field", name: { kind: "Name", value: "last_block_update_timestamp" } },
                      { kind: "Field", name: { kind: "Name", value: "owner_address" } },
                      { kind: "Field", name: { kind: "Name", value: "units" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FractionsByOwnerQuery, FractionsByOwnerQueryVariables>;
export const FractionsByHypercertDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "FractionsByHypercert" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "hypercertId" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "SortOrder" } },
          defaultValue: { kind: "EnumValue", value: "descending" },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "100" },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "hypercerts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "count" },
                value: { kind: "EnumValue", value: "COUNT" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "owner_address" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "eq" },
                            value: { kind: "Variable", name: { kind: "Name", value: "hypercertId" } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "hypercert_id" },
                            value: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "count" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hypercert_id" } },
                      { kind: "Field", name: { kind: "Name", value: "units" } },
                      { kind: "Field", name: { kind: "Name", value: "uri" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "fractions" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "count" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "data" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "creation_block_timestamp" } },
                                  { kind: "Field", name: { kind: "Name", value: "hypercert_id" } },
                                  { kind: "Field", name: { kind: "Name", value: "last_block_update_timestamp" } },
                                  { kind: "Field", name: { kind: "Name", value: "owner_address" } },
                                  { kind: "Field", name: { kind: "Name", value: "units" } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<FractionsByHypercertQuery, FractionsByHypercertQueryVariables>;
export const HypercertsByOwnerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "HypercertsByOwner" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "owner" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
          defaultValue: { kind: "StringValue", value: "", block: false },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "SortOrder" } },
          defaultValue: { kind: "EnumValue", value: "descending" },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "100" },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "hypercerts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "count" },
                value: { kind: "EnumValue", value: "COUNT" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "owner_address" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "eq" },
                            value: { kind: "Variable", name: { kind: "Name", value: "owner" } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "hypercert_id" },
                            value: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "count" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hypercert_id" } },
                      { kind: "Field", name: { kind: "Name", value: "owner_address" } },
                      { kind: "Field", name: { kind: "Name", value: "units" } },
                      { kind: "Field", name: { kind: "Name", value: "uri" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "contract" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{ kind: "Field", name: { kind: "Name", value: "chain_id" } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HypercertsByOwnerQuery, HypercertsByOwnerQueryVariables>;
export const RecentHypercertsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "RecentHypercerts" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "SortOrder" } },
          defaultValue: { kind: "EnumValue", value: "descending" },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "100" },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "offset" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "0" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "hypercerts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "count" },
                value: { kind: "EnumValue", value: "COUNT" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "offset" },
                value: { kind: "Variable", name: { kind: "Name", value: "offset" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "by" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "creation_block_timestamp" },
                            value: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "count" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hypercert_id" } },
                      { kind: "Field", name: { kind: "Name", value: "owner_address" } },
                      { kind: "Field", name: { kind: "Name", value: "units" } },
                      { kind: "Field", name: { kind: "Name", value: "uri" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "contract" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{ kind: "Field", name: { kind: "Name", value: "chain_id" } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RecentHypercertsQuery, RecentHypercertsQueryVariables>;
export const HypercertByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "HypercertById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "hypercerts" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "count" },
                value: { kind: "EnumValue", value: "COUNT" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "hypercert_id" },
                      value: {
                        kind: "ObjectValue",
                        fields: [
                          {
                            kind: "ObjectField",
                            name: { kind: "Name", value: "eq" },
                            value: { kind: "Variable", name: { kind: "Name", value: "id" } },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "count" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "data" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hypercert_id" } },
                      { kind: "Field", name: { kind: "Name", value: "owner_address" } },
                      { kind: "Field", name: { kind: "Name", value: "units" } },
                      { kind: "Field", name: { kind: "Name", value: "uri" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "contract" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{ kind: "Field", name: { kind: "Name", value: "chain_id" } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<HypercertByIdQuery, HypercertByIdQueryVariables>;
