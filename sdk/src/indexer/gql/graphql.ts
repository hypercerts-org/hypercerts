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
  BigDecimal: { input: any; output: any };
  BigInt: { input: any; output: any };
  Bytes: { input: any; output: any };
  /**
   * 8 bytes signed integer
   *
   */
  Int8: { input: any; output: any };
};

export type Allowlist = {
  __typename?: "Allowlist";
  claim: Claim;
  id: Scalars["String"]["output"];
  root: Scalars["Bytes"]["output"];
};

export type Allowlist_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Allowlist_Filter>>>;
  claim?: InputMaybe<Scalars["String"]["input"]>;
  claim_?: InputMaybe<Claim_Filter>;
  claim_contains?: InputMaybe<Scalars["String"]["input"]>;
  claim_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  claim_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_gt?: InputMaybe<Scalars["String"]["input"]>;
  claim_gte?: InputMaybe<Scalars["String"]["input"]>;
  claim_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  claim_lt?: InputMaybe<Scalars["String"]["input"]>;
  claim_lte?: InputMaybe<Scalars["String"]["input"]>;
  claim_not?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  claim_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  claim_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Allowlist_Filter>>>;
  root?: InputMaybe<Scalars["Bytes"]["input"]>;
  root_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  root_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  root_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  root_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  root_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  root_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  root_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  root_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  root_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
};

export enum Allowlist_OrderBy {
  Claim = "claim",
  ClaimContract = "claim__contract",
  ClaimCreation = "claim__creation",
  ClaimCreator = "claim__creator",
  ClaimId = "claim__id",
  ClaimOwner = "claim__owner",
  ClaimTokenId = "claim__tokenID",
  ClaimTotalUnits = "claim__totalUnits",
  ClaimUri = "claim__uri",
  Id = "id",
  Root = "root",
}

export type BlockChangedFilter = {
  number_gte: Scalars["Int"]["input"];
};

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]["input"]>;
  number?: InputMaybe<Scalars["Int"]["input"]>;
  number_gte?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Claim = {
  __typename?: "Claim";
  allowlist?: Maybe<Allowlist>;
  contract: Scalars["String"]["output"];
  creation: Scalars["BigInt"]["output"];
  creator?: Maybe<Scalars["Bytes"]["output"]>;
  id: Scalars["String"]["output"];
  owner?: Maybe<Scalars["Bytes"]["output"]>;
  tokenID: Scalars["BigInt"]["output"];
  totalUnits?: Maybe<Scalars["BigInt"]["output"]>;
  uri?: Maybe<Scalars["String"]["output"]>;
};

export type ClaimToken = {
  __typename?: "ClaimToken";
  claim: Claim;
  id: Scalars["String"]["output"];
  owner: Scalars["Bytes"]["output"];
  tokenID: Scalars["BigInt"]["output"];
  units: Scalars["BigInt"]["output"];
};

export type ClaimToken_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ClaimToken_Filter>>>;
  claim?: InputMaybe<Scalars["String"]["input"]>;
  claim_?: InputMaybe<Claim_Filter>;
  claim_contains?: InputMaybe<Scalars["String"]["input"]>;
  claim_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  claim_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_gt?: InputMaybe<Scalars["String"]["input"]>;
  claim_gte?: InputMaybe<Scalars["String"]["input"]>;
  claim_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  claim_lt?: InputMaybe<Scalars["String"]["input"]>;
  claim_lte?: InputMaybe<Scalars["String"]["input"]>;
  claim_not?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  claim_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  claim_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  claim_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  claim_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<ClaimToken_Filter>>>;
  owner?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  tokenID?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tokenID_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  units?: InputMaybe<Scalars["BigInt"]["input"]>;
  units_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  units_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  units_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  units_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  units_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  units_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  units_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
};

export enum ClaimToken_OrderBy {
  Claim = "claim",
  ClaimContract = "claim__contract",
  ClaimCreation = "claim__creation",
  ClaimCreator = "claim__creator",
  ClaimId = "claim__id",
  ClaimOwner = "claim__owner",
  ClaimTokenId = "claim__tokenID",
  ClaimTotalUnits = "claim__totalUnits",
  ClaimUri = "claim__uri",
  Id = "id",
  Owner = "owner",
  TokenId = "tokenID",
  Units = "units",
}

export type Claim_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  allowlist?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_?: InputMaybe<Allowlist_Filter>;
  allowlist_contains?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_gt?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_gte?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  allowlist_lt?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_lte?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_not?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  allowlist_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  allowlist_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  and?: InputMaybe<Array<InputMaybe<Claim_Filter>>>;
  contract?: InputMaybe<Scalars["String"]["input"]>;
  contract_contains?: InputMaybe<Scalars["String"]["input"]>;
  contract_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  contract_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  contract_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  contract_gt?: InputMaybe<Scalars["String"]["input"]>;
  contract_gte?: InputMaybe<Scalars["String"]["input"]>;
  contract_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  contract_lt?: InputMaybe<Scalars["String"]["input"]>;
  contract_lte?: InputMaybe<Scalars["String"]["input"]>;
  contract_not?: InputMaybe<Scalars["String"]["input"]>;
  contract_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  contract_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  contract_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  contract_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  contract_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  contract_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  contract_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  creation?: InputMaybe<Scalars["BigInt"]["input"]>;
  creation_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  creation_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  creation_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  creation_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  creation_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  creation_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  creation_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  creator?: InputMaybe<Scalars["Bytes"]["input"]>;
  creator_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  creator_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  creator_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  creator_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  creator_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  creator_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  creator_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  creator_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  creator_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  id_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_gt?: InputMaybe<Scalars["String"]["input"]>;
  id_gte?: InputMaybe<Scalars["String"]["input"]>;
  id_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_lt?: InputMaybe<Scalars["String"]["input"]>;
  id_lte?: InputMaybe<Scalars["String"]["input"]>;
  id_not?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  id_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  id_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  or?: InputMaybe<Array<InputMaybe<Claim_Filter>>>;
  owner?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>;
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>;
  tokenID?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  tokenID_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  tokenID_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalUnits?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalUnits_gt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalUnits_gte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalUnits_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  totalUnits_lt?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalUnits_lte?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalUnits_not?: InputMaybe<Scalars["BigInt"]["input"]>;
  totalUnits_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>;
  uri?: InputMaybe<Scalars["String"]["input"]>;
  uri_contains?: InputMaybe<Scalars["String"]["input"]>;
  uri_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  uri_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  uri_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  uri_gt?: InputMaybe<Scalars["String"]["input"]>;
  uri_gte?: InputMaybe<Scalars["String"]["input"]>;
  uri_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  uri_lt?: InputMaybe<Scalars["String"]["input"]>;
  uri_lte?: InputMaybe<Scalars["String"]["input"]>;
  uri_not?: InputMaybe<Scalars["String"]["input"]>;
  uri_not_contains?: InputMaybe<Scalars["String"]["input"]>;
  uri_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>;
  uri_not_ends_with?: InputMaybe<Scalars["String"]["input"]>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  uri_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>;
  uri_not_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
  uri_starts_with?: InputMaybe<Scalars["String"]["input"]>;
  uri_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>;
};

export enum Claim_OrderBy {
  Allowlist = "allowlist",
  AllowlistId = "allowlist__id",
  AllowlistRoot = "allowlist__root",
  Contract = "contract",
  Creation = "creation",
  Creator = "creator",
  Id = "id",
  Owner = "owner",
  TokenId = "tokenID",
  TotalUnits = "totalUnits",
  Uri = "uri",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type Query = {
  __typename?: "Query";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  allowlist?: Maybe<Allowlist>;
  allowlists: Array<Allowlist>;
  claim?: Maybe<Claim>;
  claimToken?: Maybe<ClaimToken>;
  claimTokens: Array<ClaimToken>;
  claims: Array<Claim>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryAllowlistArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryAllowlistsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Allowlist_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Allowlist_Filter>;
};

export type QueryClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryClaimTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryClaimTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ClaimToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ClaimToken_Filter>;
};

export type QueryClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Claim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Claim_Filter>;
};

export type Subscription = {
  __typename?: "Subscription";
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  allowlist?: Maybe<Allowlist>;
  allowlists: Array<Allowlist>;
  claim?: Maybe<Claim>;
  claimToken?: Maybe<ClaimToken>;
  claimTokens: Array<ClaimToken>;
  claims: Array<Claim>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionAllowlistArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionAllowlistsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Allowlist_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Allowlist_Filter>;
};

export type SubscriptionClaimArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionClaimTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars["ID"]["input"];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionClaimTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<ClaimToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ClaimToken_Filter>;
};

export type SubscriptionClaimsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  orderBy?: InputMaybe<Claim_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Claim_Filter>;
};

export type _Block_ = {
  __typename?: "_Block_";
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]["output"]>;
  /** The block number */
  number: Scalars["Int"]["output"];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]["output"]>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: "_Meta_";
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars["String"]["output"];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"]["output"];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny",
}

export type ClaimsByOwnerQueryVariables = Exact<{
  owner?: InputMaybe<Scalars["Bytes"]["input"]>;
  orderDirection?: InputMaybe<OrderDirection>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type ClaimsByOwnerQuery = {
  __typename?: "Query";
  claims: Array<{
    __typename?: "Claim";
    contract: string;
    tokenID: any;
    creator?: any | null;
    id: string;
    owner?: any | null;
    totalUnits?: any | null;
    uri?: string | null;
  }>;
};

export type RecentClaimsQueryVariables = Exact<{
  orderDirection?: InputMaybe<OrderDirection>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type RecentClaimsQuery = {
  __typename?: "Query";
  claims: Array<{
    __typename?: "Claim";
    contract: string;
    tokenID: any;
    creator?: any | null;
    id: string;
    owner?: any | null;
    totalUnits?: any | null;
    uri?: string | null;
  }>;
};

export type ClaimByIdQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ClaimByIdQuery = {
  __typename?: "Query";
  claim?: {
    __typename?: "Claim";
    contract: string;
    tokenID: any;
    creator?: any | null;
    id: string;
    owner?: any | null;
    totalUnits?: any | null;
    uri?: string | null;
  } | null;
};

export type ClaimTokensByOwnerQueryVariables = Exact<{
  owner?: InputMaybe<Scalars["Bytes"]["input"]>;
  orderDirection?: InputMaybe<OrderDirection>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type ClaimTokensByOwnerQuery = {
  __typename?: "Query";
  claimTokens: Array<{
    __typename?: "ClaimToken";
    id: string;
    owner: any;
    tokenID: any;
    units: any;
    claim: { __typename?: "Claim"; id: string; creation: any; uri?: string | null; totalUnits?: any | null };
  }>;
};

export type ClaimTokensByClaimQueryVariables = Exact<{
  claimId: Scalars["String"]["input"];
  orderDirection?: InputMaybe<OrderDirection>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type ClaimTokensByClaimQuery = {
  __typename?: "Query";
  claimTokens: Array<{ __typename?: "ClaimToken"; id: string; owner: any; tokenID: any; units: any }>;
};

export type ClaimTokenByIdQueryVariables = Exact<{
  claimTokenId: Scalars["ID"]["input"];
}>;

export type ClaimTokenByIdQuery = {
  __typename?: "Query";
  claimToken?: {
    __typename?: "ClaimToken";
    id: string;
    owner: any;
    tokenID: any;
    units: any;
    claim: { __typename?: "Claim"; id: string; creation: any; uri?: string | null; totalUnits?: any | null };
  } | null;
};

export const ClaimsByOwnerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ClaimsByOwner" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "owner" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Bytes" } },
          defaultValue: { kind: "StringValue", value: "", block: false },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OrderDirection" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "claims" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "owner" },
                      value: { kind: "Variable", name: { kind: "Name", value: "owner" } },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: { kind: "Variable", name: { kind: "Name", value: "skip" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "contract" } },
                { kind: "Field", name: { kind: "Name", value: "tokenID" } },
                { kind: "Field", name: { kind: "Name", value: "creator" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "owner" } },
                { kind: "Field", name: { kind: "Name", value: "totalUnits" } },
                { kind: "Field", name: { kind: "Name", value: "uri" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ClaimsByOwnerQuery, ClaimsByOwnerQueryVariables>;
export const RecentClaimsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "RecentClaims" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OrderDirection" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "claims" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderBy" },
                value: { kind: "EnumValue", value: "creation" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "contract" } },
                { kind: "Field", name: { kind: "Name", value: "tokenID" } },
                { kind: "Field", name: { kind: "Name", value: "creator" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "owner" } },
                { kind: "Field", name: { kind: "Name", value: "totalUnits" } },
                { kind: "Field", name: { kind: "Name", value: "uri" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RecentClaimsQuery, RecentClaimsQueryVariables>;
export const ClaimByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ClaimById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "claim" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "contract" } },
                { kind: "Field", name: { kind: "Name", value: "tokenID" } },
                { kind: "Field", name: { kind: "Name", value: "creator" } },
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "owner" } },
                { kind: "Field", name: { kind: "Name", value: "totalUnits" } },
                { kind: "Field", name: { kind: "Name", value: "uri" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ClaimByIdQuery, ClaimByIdQueryVariables>;
export const ClaimTokensByOwnerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ClaimTokensByOwner" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "owner" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Bytes" } },
          defaultValue: { kind: "StringValue", value: "", block: false },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OrderDirection" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "claimTokens" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "owner" },
                      value: { kind: "Variable", name: { kind: "Name", value: "owner" } },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: { kind: "Variable", name: { kind: "Name", value: "skip" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "owner" } },
                { kind: "Field", name: { kind: "Name", value: "tokenID" } },
                { kind: "Field", name: { kind: "Name", value: "units" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "claim" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "creation" } },
                      { kind: "Field", name: { kind: "Name", value: "uri" } },
                      { kind: "Field", name: { kind: "Name", value: "totalUnits" } },
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
} as unknown as DocumentNode<ClaimTokensByOwnerQuery, ClaimTokensByOwnerQueryVariables>;
export const ClaimTokensByClaimDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ClaimTokensByClaim" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "claimId" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OrderDirection" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "skip" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "claimTokens" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "where" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "claim" },
                      value: { kind: "Variable", name: { kind: "Name", value: "claimId" } },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "skip" },
                value: { kind: "Variable", name: { kind: "Name", value: "skip" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "orderDirection" },
                value: { kind: "Variable", name: { kind: "Name", value: "orderDirection" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "owner" } },
                { kind: "Field", name: { kind: "Name", value: "tokenID" } },
                { kind: "Field", name: { kind: "Name", value: "units" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ClaimTokensByClaimQuery, ClaimTokensByClaimQueryVariables>;
export const ClaimTokenByIdDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "ClaimTokenById" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "claimTokenId" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "ID" } } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "claimToken" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "claimTokenId" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "owner" } },
                { kind: "Field", name: { kind: "Name", value: "tokenID" } },
                { kind: "Field", name: { kind: "Name", value: "units" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "claim" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "creation" } },
                      { kind: "Field", name: { kind: "Name", value: "uri" } },
                      { kind: "Field", name: { kind: "Name", value: "totalUnits" } },
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
} as unknown as DocumentNode<ClaimTokenByIdQuery, ClaimTokenByIdQueryVariables>;
