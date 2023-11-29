// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from "@graphql-mesh/cache-localforage";
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from "@graphql-mesh/graphql"
import { parse } from 'graphql';
import UsePollingLive from "@graphprotocol/client-polling-live";
import BareMerger from "@graphql-mesh/merger-bare";
import { printWithCache } from '@graphql-mesh/utils';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, ExecuteMeshFn, SubscribeMeshFn, MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { HypercertsTypes } from './sources/Hypercerts/types';
import * as importedModule$0 from "./sources/Hypercerts/introspectionSchema";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: any;
  BigInt: any;
  Bytes: any;
  Int8: any;
};

export type Query = {
  allowlist?: Maybe<Allowlist>;
  allowlists: Array<Allowlist>;
  claim?: Maybe<Claim>;
  claims: Array<Claim>;
  claimToken?: Maybe<ClaimToken>;
  claimTokens: Array<ClaimToken>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  acceptedToken?: Maybe<AcceptedToken>;
  acceptedTokens: Array<AcceptedToken>;
  offer?: Maybe<Offer>;
  offers: Array<Offer>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryallowlistArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryallowlistsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Allowlist_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Allowlist_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryclaimArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryclaimsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Claim_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Claim_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryclaimTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryclaimTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ClaimToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ClaimToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryacceptedTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryacceptedTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AcceptedToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AcceptedToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryofferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryoffersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Offer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Offer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytradesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Trade_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  allowlist?: Maybe<Allowlist>;
  allowlists: Array<Allowlist>;
  claim?: Maybe<Claim>;
  claims: Array<Claim>;
  claimToken?: Maybe<ClaimToken>;
  claimTokens: Array<ClaimToken>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  acceptedToken?: Maybe<AcceptedToken>;
  acceptedTokens: Array<AcceptedToken>;
  offer?: Maybe<Offer>;
  offers: Array<Offer>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionallowlistArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionallowlistsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Allowlist_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Allowlist_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionclaimArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionclaimsArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Claim_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Claim_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionclaimTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionclaimTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ClaimToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<ClaimToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Token_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionacceptedTokenArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionacceptedTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AcceptedToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AcceptedToken_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionofferArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionoffersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Offer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Offer_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradeArgs = {
  id: Scalars['ID'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontradesArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Trade_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type AcceptedToken = {
  id: Scalars['String'];
  token: Token;
  minimumAmountPerUnit: Scalars['BigInt'];
  accepted: Scalars['Boolean'];
};

export type AcceptedToken_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_filter>;
  minimumAmountPerUnit?: InputMaybe<Scalars['BigInt']>;
  minimumAmountPerUnit_not?: InputMaybe<Scalars['BigInt']>;
  minimumAmountPerUnit_gt?: InputMaybe<Scalars['BigInt']>;
  minimumAmountPerUnit_lt?: InputMaybe<Scalars['BigInt']>;
  minimumAmountPerUnit_gte?: InputMaybe<Scalars['BigInt']>;
  minimumAmountPerUnit_lte?: InputMaybe<Scalars['BigInt']>;
  minimumAmountPerUnit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minimumAmountPerUnit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  accepted?: InputMaybe<Scalars['Boolean']>;
  accepted_not?: InputMaybe<Scalars['Boolean']>;
  accepted_in?: InputMaybe<Array<Scalars['Boolean']>>;
  accepted_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AcceptedToken_filter>>>;
  or?: InputMaybe<Array<InputMaybe<AcceptedToken_filter>>>;
};

export type AcceptedToken_orderBy =
  | 'id'
  | 'token'
  | 'token__id'
  | 'token__name'
  | 'token__symbol'
  | 'token__decimals'
  | 'minimumAmountPerUnit'
  | 'accepted';

export type Allowlist = {
  id: Scalars['String'];
  root: Scalars['Bytes'];
  claim: Claim;
};

export type Allowlist_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  root?: InputMaybe<Scalars['Bytes']>;
  root_not?: InputMaybe<Scalars['Bytes']>;
  root_gt?: InputMaybe<Scalars['Bytes']>;
  root_lt?: InputMaybe<Scalars['Bytes']>;
  root_gte?: InputMaybe<Scalars['Bytes']>;
  root_lte?: InputMaybe<Scalars['Bytes']>;
  root_in?: InputMaybe<Array<Scalars['Bytes']>>;
  root_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  root_contains?: InputMaybe<Scalars['Bytes']>;
  root_not_contains?: InputMaybe<Scalars['Bytes']>;
  claim?: InputMaybe<Scalars['String']>;
  claim_not?: InputMaybe<Scalars['String']>;
  claim_gt?: InputMaybe<Scalars['String']>;
  claim_lt?: InputMaybe<Scalars['String']>;
  claim_gte?: InputMaybe<Scalars['String']>;
  claim_lte?: InputMaybe<Scalars['String']>;
  claim_in?: InputMaybe<Array<Scalars['String']>>;
  claim_not_in?: InputMaybe<Array<Scalars['String']>>;
  claim_contains?: InputMaybe<Scalars['String']>;
  claim_contains_nocase?: InputMaybe<Scalars['String']>;
  claim_not_contains?: InputMaybe<Scalars['String']>;
  claim_not_contains_nocase?: InputMaybe<Scalars['String']>;
  claim_starts_with?: InputMaybe<Scalars['String']>;
  claim_starts_with_nocase?: InputMaybe<Scalars['String']>;
  claim_not_starts_with?: InputMaybe<Scalars['String']>;
  claim_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  claim_ends_with?: InputMaybe<Scalars['String']>;
  claim_ends_with_nocase?: InputMaybe<Scalars['String']>;
  claim_not_ends_with?: InputMaybe<Scalars['String']>;
  claim_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  claim_?: InputMaybe<Claim_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Allowlist_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Allowlist_filter>>>;
};

export type Allowlist_orderBy =
  | 'id'
  | 'root'
  | 'claim'
  | 'claim__id'
  | 'claim__creation'
  | 'claim__tokenID'
  | 'claim__contract'
  | 'claim__uri'
  | 'claim__creator'
  | 'claim__owner'
  | 'claim__totalUnits';

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

export type Claim = {
  id: Scalars['String'];
  creation: Scalars['BigInt'];
  tokenID: Scalars['BigInt'];
  contract: Scalars['String'];
  uri?: Maybe<Scalars['String']>;
  creator?: Maybe<Scalars['Bytes']>;
  owner?: Maybe<Scalars['Bytes']>;
  totalUnits?: Maybe<Scalars['BigInt']>;
  allowlist?: Maybe<Allowlist>;
  graphName: Scalars['String'];
};

export type ClaimToken = {
  id: Scalars['String'];
  tokenID: Scalars['BigInt'];
  claim: Claim;
  owner: Scalars['Bytes'];
  units: Scalars['BigInt'];
  offers?: Maybe<Array<Offer>>;
  graphName: Scalars['String'];
};


export type ClaimTokenoffersArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Offer_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Offer_filter>;
};

export type ClaimToken_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  tokenID?: InputMaybe<Scalars['BigInt']>;
  tokenID_not?: InputMaybe<Scalars['BigInt']>;
  tokenID_gt?: InputMaybe<Scalars['BigInt']>;
  tokenID_lt?: InputMaybe<Scalars['BigInt']>;
  tokenID_gte?: InputMaybe<Scalars['BigInt']>;
  tokenID_lte?: InputMaybe<Scalars['BigInt']>;
  tokenID_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  claim?: InputMaybe<Scalars['String']>;
  claim_not?: InputMaybe<Scalars['String']>;
  claim_gt?: InputMaybe<Scalars['String']>;
  claim_lt?: InputMaybe<Scalars['String']>;
  claim_gte?: InputMaybe<Scalars['String']>;
  claim_lte?: InputMaybe<Scalars['String']>;
  claim_in?: InputMaybe<Array<Scalars['String']>>;
  claim_not_in?: InputMaybe<Array<Scalars['String']>>;
  claim_contains?: InputMaybe<Scalars['String']>;
  claim_contains_nocase?: InputMaybe<Scalars['String']>;
  claim_not_contains?: InputMaybe<Scalars['String']>;
  claim_not_contains_nocase?: InputMaybe<Scalars['String']>;
  claim_starts_with?: InputMaybe<Scalars['String']>;
  claim_starts_with_nocase?: InputMaybe<Scalars['String']>;
  claim_not_starts_with?: InputMaybe<Scalars['String']>;
  claim_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  claim_ends_with?: InputMaybe<Scalars['String']>;
  claim_ends_with_nocase?: InputMaybe<Scalars['String']>;
  claim_not_ends_with?: InputMaybe<Scalars['String']>;
  claim_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  claim_?: InputMaybe<Claim_filter>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  units?: InputMaybe<Scalars['BigInt']>;
  units_not?: InputMaybe<Scalars['BigInt']>;
  units_gt?: InputMaybe<Scalars['BigInt']>;
  units_lt?: InputMaybe<Scalars['BigInt']>;
  units_gte?: InputMaybe<Scalars['BigInt']>;
  units_lte?: InputMaybe<Scalars['BigInt']>;
  units_in?: InputMaybe<Array<Scalars['BigInt']>>;
  units_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  offers_?: InputMaybe<Offer_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<ClaimToken_filter>>>;
  or?: InputMaybe<Array<InputMaybe<ClaimToken_filter>>>;
};

export type ClaimToken_orderBy =
  | 'id'
  | 'tokenID'
  | 'claim'
  | 'claim__id'
  | 'claim__creation'
  | 'claim__tokenID'
  | 'claim__contract'
  | 'claim__uri'
  | 'claim__creator'
  | 'claim__owner'
  | 'claim__totalUnits'
  | 'owner'
  | 'units'
  | 'offers';

export type Claim_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  creation?: InputMaybe<Scalars['BigInt']>;
  creation_not?: InputMaybe<Scalars['BigInt']>;
  creation_gt?: InputMaybe<Scalars['BigInt']>;
  creation_lt?: InputMaybe<Scalars['BigInt']>;
  creation_gte?: InputMaybe<Scalars['BigInt']>;
  creation_lte?: InputMaybe<Scalars['BigInt']>;
  creation_in?: InputMaybe<Array<Scalars['BigInt']>>;
  creation_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenID?: InputMaybe<Scalars['BigInt']>;
  tokenID_not?: InputMaybe<Scalars['BigInt']>;
  tokenID_gt?: InputMaybe<Scalars['BigInt']>;
  tokenID_lt?: InputMaybe<Scalars['BigInt']>;
  tokenID_gte?: InputMaybe<Scalars['BigInt']>;
  tokenID_lte?: InputMaybe<Scalars['BigInt']>;
  tokenID_in?: InputMaybe<Array<Scalars['BigInt']>>;
  tokenID_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  contract?: InputMaybe<Scalars['String']>;
  contract_not?: InputMaybe<Scalars['String']>;
  contract_gt?: InputMaybe<Scalars['String']>;
  contract_lt?: InputMaybe<Scalars['String']>;
  contract_gte?: InputMaybe<Scalars['String']>;
  contract_lte?: InputMaybe<Scalars['String']>;
  contract_in?: InputMaybe<Array<Scalars['String']>>;
  contract_not_in?: InputMaybe<Array<Scalars['String']>>;
  contract_contains?: InputMaybe<Scalars['String']>;
  contract_contains_nocase?: InputMaybe<Scalars['String']>;
  contract_not_contains?: InputMaybe<Scalars['String']>;
  contract_not_contains_nocase?: InputMaybe<Scalars['String']>;
  contract_starts_with?: InputMaybe<Scalars['String']>;
  contract_starts_with_nocase?: InputMaybe<Scalars['String']>;
  contract_not_starts_with?: InputMaybe<Scalars['String']>;
  contract_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  contract_ends_with?: InputMaybe<Scalars['String']>;
  contract_ends_with_nocase?: InputMaybe<Scalars['String']>;
  contract_not_ends_with?: InputMaybe<Scalars['String']>;
  contract_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  uri?: InputMaybe<Scalars['String']>;
  uri_not?: InputMaybe<Scalars['String']>;
  uri_gt?: InputMaybe<Scalars['String']>;
  uri_lt?: InputMaybe<Scalars['String']>;
  uri_gte?: InputMaybe<Scalars['String']>;
  uri_lte?: InputMaybe<Scalars['String']>;
  uri_in?: InputMaybe<Array<Scalars['String']>>;
  uri_not_in?: InputMaybe<Array<Scalars['String']>>;
  uri_contains?: InputMaybe<Scalars['String']>;
  uri_contains_nocase?: InputMaybe<Scalars['String']>;
  uri_not_contains?: InputMaybe<Scalars['String']>;
  uri_not_contains_nocase?: InputMaybe<Scalars['String']>;
  uri_starts_with?: InputMaybe<Scalars['String']>;
  uri_starts_with_nocase?: InputMaybe<Scalars['String']>;
  uri_not_starts_with?: InputMaybe<Scalars['String']>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  uri_ends_with?: InputMaybe<Scalars['String']>;
  uri_ends_with_nocase?: InputMaybe<Scalars['String']>;
  uri_not_ends_with?: InputMaybe<Scalars['String']>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  creator?: InputMaybe<Scalars['Bytes']>;
  creator_not?: InputMaybe<Scalars['Bytes']>;
  creator_gt?: InputMaybe<Scalars['Bytes']>;
  creator_lt?: InputMaybe<Scalars['Bytes']>;
  creator_gte?: InputMaybe<Scalars['Bytes']>;
  creator_lte?: InputMaybe<Scalars['Bytes']>;
  creator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  creator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  creator_contains?: InputMaybe<Scalars['Bytes']>;
  creator_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_gt?: InputMaybe<Scalars['Bytes']>;
  owner_lt?: InputMaybe<Scalars['Bytes']>;
  owner_gte?: InputMaybe<Scalars['Bytes']>;
  owner_lte?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  totalUnits?: InputMaybe<Scalars['BigInt']>;
  totalUnits_not?: InputMaybe<Scalars['BigInt']>;
  totalUnits_gt?: InputMaybe<Scalars['BigInt']>;
  totalUnits_lt?: InputMaybe<Scalars['BigInt']>;
  totalUnits_gte?: InputMaybe<Scalars['BigInt']>;
  totalUnits_lte?: InputMaybe<Scalars['BigInt']>;
  totalUnits_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUnits_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  allowlist?: InputMaybe<Scalars['String']>;
  allowlist_not?: InputMaybe<Scalars['String']>;
  allowlist_gt?: InputMaybe<Scalars['String']>;
  allowlist_lt?: InputMaybe<Scalars['String']>;
  allowlist_gte?: InputMaybe<Scalars['String']>;
  allowlist_lte?: InputMaybe<Scalars['String']>;
  allowlist_in?: InputMaybe<Array<Scalars['String']>>;
  allowlist_not_in?: InputMaybe<Array<Scalars['String']>>;
  allowlist_contains?: InputMaybe<Scalars['String']>;
  allowlist_contains_nocase?: InputMaybe<Scalars['String']>;
  allowlist_not_contains?: InputMaybe<Scalars['String']>;
  allowlist_not_contains_nocase?: InputMaybe<Scalars['String']>;
  allowlist_starts_with?: InputMaybe<Scalars['String']>;
  allowlist_starts_with_nocase?: InputMaybe<Scalars['String']>;
  allowlist_not_starts_with?: InputMaybe<Scalars['String']>;
  allowlist_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  allowlist_ends_with?: InputMaybe<Scalars['String']>;
  allowlist_ends_with_nocase?: InputMaybe<Scalars['String']>;
  allowlist_not_ends_with?: InputMaybe<Scalars['String']>;
  allowlist_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  allowlist_?: InputMaybe<Allowlist_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Claim_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Claim_filter>>>;
};

export type Claim_orderBy =
  | 'id'
  | 'creation'
  | 'tokenID'
  | 'contract'
  | 'uri'
  | 'creator'
  | 'owner'
  | 'totalUnits'
  | 'allowlist'
  | 'allowlist__id'
  | 'allowlist__root';

export type Offer = {
  id: Scalars['String'];
  fractionID: ClaimToken;
  unitsAvailable: Scalars['BigInt'];
  minUnitsPerTrade: Scalars['BigInt'];
  maxUnitsPerTrade: Scalars['BigInt'];
  status: OfferStatus;
  acceptedTokens: Array<AcceptedToken>;
};


export type OfferacceptedTokensArgs = {
  skip?: InputMaybe<Scalars['Int']>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<AcceptedToken_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AcceptedToken_filter>;
};

export type OfferStatus =
  | 'Open'
  | 'Fulfilled'
  | 'Cancelled';

export type Offer_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fractionID?: InputMaybe<Scalars['String']>;
  fractionID_not?: InputMaybe<Scalars['String']>;
  fractionID_gt?: InputMaybe<Scalars['String']>;
  fractionID_lt?: InputMaybe<Scalars['String']>;
  fractionID_gte?: InputMaybe<Scalars['String']>;
  fractionID_lte?: InputMaybe<Scalars['String']>;
  fractionID_in?: InputMaybe<Array<Scalars['String']>>;
  fractionID_not_in?: InputMaybe<Array<Scalars['String']>>;
  fractionID_contains?: InputMaybe<Scalars['String']>;
  fractionID_contains_nocase?: InputMaybe<Scalars['String']>;
  fractionID_not_contains?: InputMaybe<Scalars['String']>;
  fractionID_not_contains_nocase?: InputMaybe<Scalars['String']>;
  fractionID_starts_with?: InputMaybe<Scalars['String']>;
  fractionID_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fractionID_not_starts_with?: InputMaybe<Scalars['String']>;
  fractionID_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  fractionID_ends_with?: InputMaybe<Scalars['String']>;
  fractionID_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fractionID_not_ends_with?: InputMaybe<Scalars['String']>;
  fractionID_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  fractionID_?: InputMaybe<ClaimToken_filter>;
  unitsAvailable?: InputMaybe<Scalars['BigInt']>;
  unitsAvailable_not?: InputMaybe<Scalars['BigInt']>;
  unitsAvailable_gt?: InputMaybe<Scalars['BigInt']>;
  unitsAvailable_lt?: InputMaybe<Scalars['BigInt']>;
  unitsAvailable_gte?: InputMaybe<Scalars['BigInt']>;
  unitsAvailable_lte?: InputMaybe<Scalars['BigInt']>;
  unitsAvailable_in?: InputMaybe<Array<Scalars['BigInt']>>;
  unitsAvailable_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minUnitsPerTrade?: InputMaybe<Scalars['BigInt']>;
  minUnitsPerTrade_not?: InputMaybe<Scalars['BigInt']>;
  minUnitsPerTrade_gt?: InputMaybe<Scalars['BigInt']>;
  minUnitsPerTrade_lt?: InputMaybe<Scalars['BigInt']>;
  minUnitsPerTrade_gte?: InputMaybe<Scalars['BigInt']>;
  minUnitsPerTrade_lte?: InputMaybe<Scalars['BigInt']>;
  minUnitsPerTrade_in?: InputMaybe<Array<Scalars['BigInt']>>;
  minUnitsPerTrade_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxUnitsPerTrade?: InputMaybe<Scalars['BigInt']>;
  maxUnitsPerTrade_not?: InputMaybe<Scalars['BigInt']>;
  maxUnitsPerTrade_gt?: InputMaybe<Scalars['BigInt']>;
  maxUnitsPerTrade_lt?: InputMaybe<Scalars['BigInt']>;
  maxUnitsPerTrade_gte?: InputMaybe<Scalars['BigInt']>;
  maxUnitsPerTrade_lte?: InputMaybe<Scalars['BigInt']>;
  maxUnitsPerTrade_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxUnitsPerTrade_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  status?: InputMaybe<OfferStatus>;
  status_not?: InputMaybe<OfferStatus>;
  status_in?: InputMaybe<Array<OfferStatus>>;
  status_not_in?: InputMaybe<Array<OfferStatus>>;
  acceptedTokens?: InputMaybe<Array<Scalars['String']>>;
  acceptedTokens_not?: InputMaybe<Array<Scalars['String']>>;
  acceptedTokens_contains?: InputMaybe<Array<Scalars['String']>>;
  acceptedTokens_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  acceptedTokens_not_contains?: InputMaybe<Array<Scalars['String']>>;
  acceptedTokens_not_contains_nocase?: InputMaybe<Array<Scalars['String']>>;
  acceptedTokens_?: InputMaybe<AcceptedToken_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Offer_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Offer_filter>>>;
};

export type Offer_orderBy =
  | 'id'
  | 'fractionID'
  | 'fractionID__id'
  | 'fractionID__tokenID'
  | 'fractionID__owner'
  | 'fractionID__units'
  | 'unitsAvailable'
  | 'minUnitsPerTrade'
  | 'maxUnitsPerTrade'
  | 'status'
  | 'acceptedTokens';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type Token = {
  id: Scalars['String'];
  name: Scalars['String'];
  symbol?: Maybe<Scalars['String']>;
  decimals?: Maybe<Scalars['BigInt']>;
};

export type Token_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_contains_nocase?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_contains_nocase?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_ends_with_nocase?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_contains_nocase?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_ends_with_nocase?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  decimals?: InputMaybe<Scalars['BigInt']>;
  decimals_not?: InputMaybe<Scalars['BigInt']>;
  decimals_gt?: InputMaybe<Scalars['BigInt']>;
  decimals_lt?: InputMaybe<Scalars['BigInt']>;
  decimals_gte?: InputMaybe<Scalars['BigInt']>;
  decimals_lte?: InputMaybe<Scalars['BigInt']>;
  decimals_in?: InputMaybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Token_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Token_filter>>>;
};

export type Token_orderBy =
  | 'id'
  | 'name'
  | 'symbol'
  | 'decimals';

export type Trade = {
  id: Scalars['String'];
  buyer: Scalars['Bytes'];
  offerID: Offer;
  unitsSold: Scalars['BigInt'];
  token: Token;
  amountPerUnit: Scalars['BigInt'];
};

export type Trade_filter = {
  id?: InputMaybe<Scalars['String']>;
  id_not?: InputMaybe<Scalars['String']>;
  id_gt?: InputMaybe<Scalars['String']>;
  id_lt?: InputMaybe<Scalars['String']>;
  id_gte?: InputMaybe<Scalars['String']>;
  id_lte?: InputMaybe<Scalars['String']>;
  id_in?: InputMaybe<Array<Scalars['String']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']>>;
  id_contains?: InputMaybe<Scalars['String']>;
  id_contains_nocase?: InputMaybe<Scalars['String']>;
  id_not_contains?: InputMaybe<Scalars['String']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']>;
  id_starts_with?: InputMaybe<Scalars['String']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_starts_with?: InputMaybe<Scalars['String']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  id_ends_with?: InputMaybe<Scalars['String']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']>;
  id_not_ends_with?: InputMaybe<Scalars['String']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  buyer?: InputMaybe<Scalars['Bytes']>;
  buyer_not?: InputMaybe<Scalars['Bytes']>;
  buyer_gt?: InputMaybe<Scalars['Bytes']>;
  buyer_lt?: InputMaybe<Scalars['Bytes']>;
  buyer_gte?: InputMaybe<Scalars['Bytes']>;
  buyer_lte?: InputMaybe<Scalars['Bytes']>;
  buyer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  buyer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  buyer_contains?: InputMaybe<Scalars['Bytes']>;
  buyer_not_contains?: InputMaybe<Scalars['Bytes']>;
  offerID?: InputMaybe<Scalars['String']>;
  offerID_not?: InputMaybe<Scalars['String']>;
  offerID_gt?: InputMaybe<Scalars['String']>;
  offerID_lt?: InputMaybe<Scalars['String']>;
  offerID_gte?: InputMaybe<Scalars['String']>;
  offerID_lte?: InputMaybe<Scalars['String']>;
  offerID_in?: InputMaybe<Array<Scalars['String']>>;
  offerID_not_in?: InputMaybe<Array<Scalars['String']>>;
  offerID_contains?: InputMaybe<Scalars['String']>;
  offerID_contains_nocase?: InputMaybe<Scalars['String']>;
  offerID_not_contains?: InputMaybe<Scalars['String']>;
  offerID_not_contains_nocase?: InputMaybe<Scalars['String']>;
  offerID_starts_with?: InputMaybe<Scalars['String']>;
  offerID_starts_with_nocase?: InputMaybe<Scalars['String']>;
  offerID_not_starts_with?: InputMaybe<Scalars['String']>;
  offerID_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  offerID_ends_with?: InputMaybe<Scalars['String']>;
  offerID_ends_with_nocase?: InputMaybe<Scalars['String']>;
  offerID_not_ends_with?: InputMaybe<Scalars['String']>;
  offerID_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  offerID_?: InputMaybe<Offer_filter>;
  unitsSold?: InputMaybe<Scalars['BigInt']>;
  unitsSold_not?: InputMaybe<Scalars['BigInt']>;
  unitsSold_gt?: InputMaybe<Scalars['BigInt']>;
  unitsSold_lt?: InputMaybe<Scalars['BigInt']>;
  unitsSold_gte?: InputMaybe<Scalars['BigInt']>;
  unitsSold_lte?: InputMaybe<Scalars['BigInt']>;
  unitsSold_in?: InputMaybe<Array<Scalars['BigInt']>>;
  unitsSold_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_contains_nocase?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_contains_nocase?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_not_starts_with_nocase?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_ends_with_nocase?: InputMaybe<Scalars['String']>;
  token_?: InputMaybe<Token_filter>;
  amountPerUnit?: InputMaybe<Scalars['BigInt']>;
  amountPerUnit_not?: InputMaybe<Scalars['BigInt']>;
  amountPerUnit_gt?: InputMaybe<Scalars['BigInt']>;
  amountPerUnit_lt?: InputMaybe<Scalars['BigInt']>;
  amountPerUnit_gte?: InputMaybe<Scalars['BigInt']>;
  amountPerUnit_lte?: InputMaybe<Scalars['BigInt']>;
  amountPerUnit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amountPerUnit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Trade_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Trade_filter>>>;
};

export type Trade_orderBy =
  | 'id'
  | 'buyer'
  | 'offerID'
  | 'offerID__id'
  | 'offerID__unitsAvailable'
  | 'offerID__minUnitsPerTrade'
  | 'offerID__maxUnitsPerTrade'
  | 'offerID__status'
  | 'unitsSold'
  | 'token'
  | 'token__id'
  | 'token__name'
  | 'token__symbol'
  | 'token__decimals'
  | 'amountPerUnit';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Subscription: ResolverTypeWrapper<{}>;
  AcceptedToken: ResolverTypeWrapper<AcceptedToken>;
  AcceptedToken_filter: AcceptedToken_filter;
  AcceptedToken_orderBy: AcceptedToken_orderBy;
  Allowlist: ResolverTypeWrapper<Allowlist>;
  Allowlist_filter: Allowlist_filter;
  Allowlist_orderBy: Allowlist_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']>;
  Claim: ResolverTypeWrapper<Claim>;
  ClaimToken: ResolverTypeWrapper<ClaimToken>;
  ClaimToken_filter: ClaimToken_filter;
  ClaimToken_orderBy: ClaimToken_orderBy;
  Claim_filter: Claim_filter;
  Claim_orderBy: Claim_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']>;
  Offer: ResolverTypeWrapper<Offer>;
  OfferStatus: OfferStatus;
  Offer_filter: Offer_filter;
  Offer_orderBy: Offer_orderBy;
  OrderDirection: OrderDirection;
  String: ResolverTypeWrapper<Scalars['String']>;
  Token: ResolverTypeWrapper<Token>;
  Token_filter: Token_filter;
  Token_orderBy: Token_orderBy;
  Trade: ResolverTypeWrapper<Trade>;
  Trade_filter: Trade_filter;
  Trade_orderBy: Trade_orderBy;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Subscription: {};
  AcceptedToken: AcceptedToken;
  AcceptedToken_filter: AcceptedToken_filter;
  Allowlist: Allowlist;
  Allowlist_filter: Allowlist_filter;
  BigDecimal: Scalars['BigDecimal'];
  BigInt: Scalars['BigInt'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean'];
  Bytes: Scalars['Bytes'];
  Claim: Claim;
  ClaimToken: ClaimToken;
  ClaimToken_filter: ClaimToken_filter;
  Claim_filter: Claim_filter;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Int8: Scalars['Int8'];
  Offer: Offer;
  Offer_filter: Offer_filter;
  String: Scalars['String'];
  Token: Token;
  Token_filter: Token_filter;
  Trade: Trade;
  Trade_filter: Trade_filter;
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = { };

export type entityDirectiveResolver<Result, Parent, ContextType = MeshContext & { graphName: string }, Args = entityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String'];
};

export type subgraphIdDirectiveResolver<Result, Parent, ContextType = MeshContext & { graphName: string }, Args = subgraphIdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String'];
};

export type derivedFromDirectiveResolver<Result, Parent, ContextType = MeshContext & { graphName: string }, Args = derivedFromDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allowlist?: Resolver<Maybe<ResolversTypes['Allowlist']>, ParentType, ContextType, RequireFields<QueryallowlistArgs, 'id' | 'subgraphError'>>;
  allowlists?: Resolver<Array<ResolversTypes['Allowlist']>, ParentType, ContextType, RequireFields<QueryallowlistsArgs, 'skip' | 'first' | 'subgraphError'>>;
  claim?: Resolver<Maybe<ResolversTypes['Claim']>, ParentType, ContextType, RequireFields<QueryclaimArgs, 'id' | 'subgraphError'>>;
  claims?: Resolver<Array<ResolversTypes['Claim']>, ParentType, ContextType, RequireFields<QueryclaimsArgs, 'skip' | 'first' | 'subgraphError'>>;
  claimToken?: Resolver<Maybe<ResolversTypes['ClaimToken']>, ParentType, ContextType, RequireFields<QueryclaimTokenArgs, 'id' | 'subgraphError'>>;
  claimTokens?: Resolver<Array<ResolversTypes['ClaimToken']>, ParentType, ContextType, RequireFields<QueryclaimTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  token?: Resolver<Maybe<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QuerytokenArgs, 'id' | 'subgraphError'>>;
  tokens?: Resolver<Array<ResolversTypes['Token']>, ParentType, ContextType, RequireFields<QuerytokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  acceptedToken?: Resolver<Maybe<ResolversTypes['AcceptedToken']>, ParentType, ContextType, RequireFields<QueryacceptedTokenArgs, 'id' | 'subgraphError'>>;
  acceptedTokens?: Resolver<Array<ResolversTypes['AcceptedToken']>, ParentType, ContextType, RequireFields<QueryacceptedTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  offer?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType, RequireFields<QueryofferArgs, 'id' | 'subgraphError'>>;
  offers?: Resolver<Array<ResolversTypes['Offer']>, ParentType, ContextType, RequireFields<QueryoffersArgs, 'skip' | 'first' | 'subgraphError'>>;
  trade?: Resolver<Maybe<ResolversTypes['Trade']>, ParentType, ContextType, RequireFields<QuerytradeArgs, 'id' | 'subgraphError'>>;
  trades?: Resolver<Array<ResolversTypes['Trade']>, ParentType, ContextType, RequireFields<QuerytradesArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: Resolver<Maybe<ResolversTypes['_Meta_']>, ParentType, ContextType, Partial<Query_metaArgs>>;
}>;

export type SubscriptionResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
  allowlist?: SubscriptionResolver<Maybe<ResolversTypes['Allowlist']>, "allowlist", ParentType, ContextType, RequireFields<SubscriptionallowlistArgs, 'id' | 'subgraphError'>>;
  allowlists?: SubscriptionResolver<Array<ResolversTypes['Allowlist']>, "allowlists", ParentType, ContextType, RequireFields<SubscriptionallowlistsArgs, 'skip' | 'first' | 'subgraphError'>>;
  claim?: SubscriptionResolver<Maybe<ResolversTypes['Claim']>, "claim", ParentType, ContextType, RequireFields<SubscriptionclaimArgs, 'id' | 'subgraphError'>>;
  claims?: SubscriptionResolver<Array<ResolversTypes['Claim']>, "claims", ParentType, ContextType, RequireFields<SubscriptionclaimsArgs, 'skip' | 'first' | 'subgraphError'>>;
  claimToken?: SubscriptionResolver<Maybe<ResolversTypes['ClaimToken']>, "claimToken", ParentType, ContextType, RequireFields<SubscriptionclaimTokenArgs, 'id' | 'subgraphError'>>;
  claimTokens?: SubscriptionResolver<Array<ResolversTypes['ClaimToken']>, "claimTokens", ParentType, ContextType, RequireFields<SubscriptionclaimTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  token?: SubscriptionResolver<Maybe<ResolversTypes['Token']>, "token", ParentType, ContextType, RequireFields<SubscriptiontokenArgs, 'id' | 'subgraphError'>>;
  tokens?: SubscriptionResolver<Array<ResolversTypes['Token']>, "tokens", ParentType, ContextType, RequireFields<SubscriptiontokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  acceptedToken?: SubscriptionResolver<Maybe<ResolversTypes['AcceptedToken']>, "acceptedToken", ParentType, ContextType, RequireFields<SubscriptionacceptedTokenArgs, 'id' | 'subgraphError'>>;
  acceptedTokens?: SubscriptionResolver<Array<ResolversTypes['AcceptedToken']>, "acceptedTokens", ParentType, ContextType, RequireFields<SubscriptionacceptedTokensArgs, 'skip' | 'first' | 'subgraphError'>>;
  offer?: SubscriptionResolver<Maybe<ResolversTypes['Offer']>, "offer", ParentType, ContextType, RequireFields<SubscriptionofferArgs, 'id' | 'subgraphError'>>;
  offers?: SubscriptionResolver<Array<ResolversTypes['Offer']>, "offers", ParentType, ContextType, RequireFields<SubscriptionoffersArgs, 'skip' | 'first' | 'subgraphError'>>;
  trade?: SubscriptionResolver<Maybe<ResolversTypes['Trade']>, "trade", ParentType, ContextType, RequireFields<SubscriptiontradeArgs, 'id' | 'subgraphError'>>;
  trades?: SubscriptionResolver<Array<ResolversTypes['Trade']>, "trades", ParentType, ContextType, RequireFields<SubscriptiontradesArgs, 'skip' | 'first' | 'subgraphError'>>;
  _meta?: SubscriptionResolver<Maybe<ResolversTypes['_Meta_']>, "_meta", ParentType, ContextType, Partial<Subscription_metaArgs>>;
}>;

export type AcceptedTokenResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['AcceptedToken'] = ResolversParentTypes['AcceptedToken']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  minimumAmountPerUnit?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  accepted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AllowlistResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['Allowlist'] = ResolversParentTypes['Allowlist']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  root?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  claim?: Resolver<ResolversTypes['Claim'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type ClaimResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['Claim'] = ResolversParentTypes['Claim']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creation?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tokenID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  contract?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  uri?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creator?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  totalUnits?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  allowlist?: Resolver<Maybe<ResolversTypes['Allowlist']>, ParentType, ContextType>;
  graphName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClaimTokenResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['ClaimToken'] = ResolversParentTypes['ClaimToken']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tokenID?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  claim?: Resolver<ResolversTypes['Claim'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  units?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  offers?: Resolver<Maybe<Array<ResolversTypes['Offer']>>, ParentType, ContextType, RequireFields<ClaimTokenoffersArgs, 'skip' | 'first'>>;
  graphName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type OfferResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['Offer'] = ResolversParentTypes['Offer']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fractionID?: Resolver<ResolversTypes['ClaimToken'], ParentType, ContextType>;
  unitsAvailable?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  minUnitsPerTrade?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  maxUnitsPerTrade?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OfferStatus'], ParentType, ContextType>;
  acceptedTokens?: Resolver<Array<ResolversTypes['AcceptedToken']>, ParentType, ContextType, RequireFields<OfferacceptedTokensArgs, 'skip' | 'first'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  symbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decimals?: Resolver<Maybe<ResolversTypes['BigInt']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TradeResolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['Trade'] = ResolversParentTypes['Trade']> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  buyer?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  offerID?: Resolver<ResolversTypes['Offer'], ParentType, ContextType>;
  unitsSold?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['Token'], ParentType, ContextType>;
  amountPerUnit?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Block_Resolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<ContextType = MeshContext & { graphName: string }, ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext & { graphName: string }> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  AcceptedToken?: AcceptedTokenResolvers<ContextType>;
  Allowlist?: AllowlistResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  Claim?: ClaimResolvers<ContextType>;
  ClaimToken?: ClaimTokenResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  Offer?: OfferResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  Trade?: TradeResolvers<ContextType>;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext & { graphName: string }> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = HypercertsTypes.Context & BaseMeshContext;


const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".graphclient/sources/Hypercerts/introspectionSchema":
      return Promise.resolve(importedModule$0) as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.graphclient', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("GraphClient");
const cache = new (MeshCache as any)({
      ...({} as any),
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    } as any)

const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const hypercertsTransforms = [];
const hypercertsHandler = new GraphqlHandler({
              name: "Hypercerts",
              config: {"endpoint":"https://api.thegraph.com/subgraphs/name/hypercerts-admin/{context.graphName:hypercerts-testnet}"},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("Hypercerts"),
              logger: logger.child("Hypercerts"),
              importFn,
            });
sources[0] = {
          name: 'Hypercerts',
          handler: hypercertsHandler,
          transforms: hypercertsTransforms
        }
const additionalTypeDefs = [parse("extend type Claim {\n  graphName: String!\n}\n\nextend type ClaimToken {\n  graphName: String!\n}"),] as any[];
additionalEnvelopPlugins[0] = await UsePollingLive({
          ...({
  "defaultInterval": 5000
}),
          logger: logger.child("pollingLive"),
          cache,
          pubsub,
          baseDir,
          importFn,
        })
const additionalResolvers = await Promise.all([
        import("../src/utils/resolvers.ts")
            .then(m => m.resolvers || m.default || m)
      ]);
const merger = new(BareMerger as any)({
        cache,
        pubsub,
        logger: logger.child('bareMerger'),
        store: rootStore.child('bareMerger')
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      {
        document: ClaimsByOwnerDocument,
        get rawSDL() {
          return printWithCache(ClaimsByOwnerDocument);
        },
        location: 'ClaimsByOwnerDocument.graphql'
      },{
        document: RecentClaimsDocument,
        get rawSDL() {
          return printWithCache(RecentClaimsDocument);
        },
        location: 'RecentClaimsDocument.graphql'
      },{
        document: ClaimByIdDocument,
        get rawSDL() {
          return printWithCache(ClaimByIdDocument);
        },
        location: 'ClaimByIdDocument.graphql'
      },{
        document: ClaimTokensByOwnerDocument,
        get rawSDL() {
          return printWithCache(ClaimTokensByOwnerDocument);
        },
        location: 'ClaimTokensByOwnerDocument.graphql'
      },{
        document: ClaimTokensByClaimDocument,
        get rawSDL() {
          return printWithCache(ClaimTokensByClaimDocument);
        },
        location: 'ClaimTokensByClaimDocument.graphql'
      },{
        document: ClaimTokenByIdDocument,
        get rawSDL() {
          return printWithCache(ClaimTokenByIdDocument);
        },
        location: 'ClaimTokenByIdDocument.graphql'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type ClaimsByOwnerQueryVariables = Exact<{
  owner?: InputMaybe<Scalars['Bytes']>;
  orderDirection?: InputMaybe<OrderDirection>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type ClaimsByOwnerQuery = { claims: Array<Pick<Claim, 'graphName' | 'contract' | 'tokenID' | 'creator' | 'id' | 'owner' | 'totalUnits' | 'uri'>> };

export type RecentClaimsQueryVariables = Exact<{
  orderDirection?: InputMaybe<OrderDirection>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type RecentClaimsQuery = { claims: Array<Pick<Claim, 'graphName' | 'contract' | 'tokenID' | 'creator' | 'id' | 'owner' | 'totalUnits' | 'uri'>> };

export type ClaimByIdQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ClaimByIdQuery = { claim?: Maybe<Pick<Claim, 'graphName' | 'contract' | 'tokenID' | 'creator' | 'id' | 'owner' | 'totalUnits' | 'uri'>> };

export type ClaimTokensByOwnerQueryVariables = Exact<{
  owner?: InputMaybe<Scalars['Bytes']>;
  orderDirection?: InputMaybe<OrderDirection>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type ClaimTokensByOwnerQuery = { claimTokens: Array<(
    Pick<ClaimToken, 'graphName' | 'id' | 'owner' | 'tokenID' | 'units'>
    & { claim: Pick<Claim, 'id' | 'creation' | 'uri' | 'totalUnits'> }
  )> };

export type ClaimTokensByClaimQueryVariables = Exact<{
  claimId: Scalars['String'];
  orderDirection?: InputMaybe<OrderDirection>;
  first?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
}>;


export type ClaimTokensByClaimQuery = { claimTokens: Array<Pick<ClaimToken, 'graphName' | 'id' | 'owner' | 'tokenID' | 'units'>> };

export type ClaimTokenByIdQueryVariables = Exact<{
  claimTokenId: Scalars['ID'];
}>;


export type ClaimTokenByIdQuery = { claimToken?: Maybe<(
    Pick<ClaimToken, 'graphName' | 'id' | 'owner' | 'tokenID' | 'units'>
    & { claim: Pick<Claim, 'id' | 'creation' | 'uri' | 'totalUnits'> }
  )> };


export const ClaimsByOwnerDocument = gql`
    query ClaimsByOwner($owner: Bytes = "", $orderDirection: OrderDirection, $first: Int, $skip: Int) {
  claims(
    where: {owner: $owner}
    skip: $skip
    first: $first
    orderDirection: $orderDirection
  ) {
    graphName
    contract
    tokenID
    creator
    id
    owner
    totalUnits
    uri
  }
}
    ` as unknown as DocumentNode<ClaimsByOwnerQuery, ClaimsByOwnerQueryVariables>;
export const RecentClaimsDocument = gql`
    query RecentClaims($orderDirection: OrderDirection, $first: Int, $skip: Int) {
  claims(orderDirection: $orderDirection, orderBy: creation, first: $first) {
    graphName
    contract
    tokenID
    creator
    id
    owner
    totalUnits
    uri
  }
}
    ` as unknown as DocumentNode<RecentClaimsQuery, RecentClaimsQueryVariables>;
export const ClaimByIdDocument = gql`
    query ClaimById($id: ID!) {
  claim(id: $id) {
    graphName
    contract
    tokenID
    creator
    id
    owner
    totalUnits
    uri
  }
}
    ` as unknown as DocumentNode<ClaimByIdQuery, ClaimByIdQueryVariables>;
export const ClaimTokensByOwnerDocument = gql`
    query ClaimTokensByOwner($owner: Bytes = "", $orderDirection: OrderDirection, $first: Int, $skip: Int) {
  claimTokens(
    where: {owner: $owner}
    skip: $skip
    first: $first
    orderDirection: $orderDirection
  ) {
    graphName
    id
    owner
    tokenID
    units
    claim {
      id
      creation
      uri
      totalUnits
    }
  }
}
    ` as unknown as DocumentNode<ClaimTokensByOwnerQuery, ClaimTokensByOwnerQueryVariables>;
export const ClaimTokensByClaimDocument = gql`
    query ClaimTokensByClaim($claimId: String!, $orderDirection: OrderDirection, $first: Int, $skip: Int) {
  claimTokens(
    where: {claim: $claimId}
    skip: $skip
    first: $first
    orderDirection: $orderDirection
  ) {
    graphName
    id
    owner
    tokenID
    units
  }
}
    ` as unknown as DocumentNode<ClaimTokensByClaimQuery, ClaimTokensByClaimQueryVariables>;
export const ClaimTokenByIdDocument = gql`
    query ClaimTokenById($claimTokenId: ID!) {
  claimToken(id: $claimTokenId) {
    graphName
    id
    owner
    tokenID
    units
    claim {
      id
      creation
      uri
      totalUnits
    }
  }
}
    ` as unknown as DocumentNode<ClaimTokenByIdQuery, ClaimTokenByIdQueryVariables>;







export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    ClaimsByOwner(variables?: ClaimsByOwnerQueryVariables, options?: C): Promise<ClaimsByOwnerQuery> {
      return requester<ClaimsByOwnerQuery, ClaimsByOwnerQueryVariables>(ClaimsByOwnerDocument, variables, options) as Promise<ClaimsByOwnerQuery>;
    },
    RecentClaims(variables?: RecentClaimsQueryVariables, options?: C): Promise<RecentClaimsQuery> {
      return requester<RecentClaimsQuery, RecentClaimsQueryVariables>(RecentClaimsDocument, variables, options) as Promise<RecentClaimsQuery>;
    },
    ClaimById(variables: ClaimByIdQueryVariables, options?: C): Promise<ClaimByIdQuery> {
      return requester<ClaimByIdQuery, ClaimByIdQueryVariables>(ClaimByIdDocument, variables, options) as Promise<ClaimByIdQuery>;
    },
    ClaimTokensByOwner(variables?: ClaimTokensByOwnerQueryVariables, options?: C): Promise<ClaimTokensByOwnerQuery> {
      return requester<ClaimTokensByOwnerQuery, ClaimTokensByOwnerQueryVariables>(ClaimTokensByOwnerDocument, variables, options) as Promise<ClaimTokensByOwnerQuery>;
    },
    ClaimTokensByClaim(variables: ClaimTokensByClaimQueryVariables, options?: C): Promise<ClaimTokensByClaimQuery> {
      return requester<ClaimTokensByClaimQuery, ClaimTokensByClaimQueryVariables>(ClaimTokensByClaimDocument, variables, options) as Promise<ClaimTokensByClaimQuery>;
    },
    ClaimTokenById(variables: ClaimTokenByIdQueryVariables, options?: C): Promise<ClaimTokenByIdQuery> {
      return requester<ClaimTokenByIdQuery, ClaimTokenByIdQueryVariables>(ClaimTokenByIdDocument, variables, options) as Promise<ClaimTokenByIdQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;