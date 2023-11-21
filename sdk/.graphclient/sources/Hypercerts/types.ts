// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace HypercertsTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
};

export type ClaimToken = {
  id: Scalars['String'];
  tokenID: Scalars['BigInt'];
  claim: Claim;
  owner: Scalars['Bytes'];
  units: Scalars['BigInt'];
  offers?: Maybe<Array<Offer>>;
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

  export type QuerySdk = {
      /** null **/
  allowlist: InContextSdkMethod<Query['allowlist'], QueryallowlistArgs, MeshContext>,
  /** null **/
  allowlists: InContextSdkMethod<Query['allowlists'], QueryallowlistsArgs, MeshContext>,
  /** null **/
  claim: InContextSdkMethod<Query['claim'], QueryclaimArgs, MeshContext>,
  /** null **/
  claims: InContextSdkMethod<Query['claims'], QueryclaimsArgs, MeshContext>,
  /** null **/
  claimToken: InContextSdkMethod<Query['claimToken'], QueryclaimTokenArgs, MeshContext>,
  /** null **/
  claimTokens: InContextSdkMethod<Query['claimTokens'], QueryclaimTokensArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<Query['token'], QuerytokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<Query['tokens'], QuerytokensArgs, MeshContext>,
  /** null **/
  acceptedToken: InContextSdkMethod<Query['acceptedToken'], QueryacceptedTokenArgs, MeshContext>,
  /** null **/
  acceptedTokens: InContextSdkMethod<Query['acceptedTokens'], QueryacceptedTokensArgs, MeshContext>,
  /** null **/
  offer: InContextSdkMethod<Query['offer'], QueryofferArgs, MeshContext>,
  /** null **/
  offers: InContextSdkMethod<Query['offers'], QueryoffersArgs, MeshContext>,
  /** null **/
  trade: InContextSdkMethod<Query['trade'], QuerytradeArgs, MeshContext>,
  /** null **/
  trades: InContextSdkMethod<Query['trades'], QuerytradesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  allowlist: InContextSdkMethod<Subscription['allowlist'], SubscriptionallowlistArgs, MeshContext>,
  /** null **/
  allowlists: InContextSdkMethod<Subscription['allowlists'], SubscriptionallowlistsArgs, MeshContext>,
  /** null **/
  claim: InContextSdkMethod<Subscription['claim'], SubscriptionclaimArgs, MeshContext>,
  /** null **/
  claims: InContextSdkMethod<Subscription['claims'], SubscriptionclaimsArgs, MeshContext>,
  /** null **/
  claimToken: InContextSdkMethod<Subscription['claimToken'], SubscriptionclaimTokenArgs, MeshContext>,
  /** null **/
  claimTokens: InContextSdkMethod<Subscription['claimTokens'], SubscriptionclaimTokensArgs, MeshContext>,
  /** null **/
  token: InContextSdkMethod<Subscription['token'], SubscriptiontokenArgs, MeshContext>,
  /** null **/
  tokens: InContextSdkMethod<Subscription['tokens'], SubscriptiontokensArgs, MeshContext>,
  /** null **/
  acceptedToken: InContextSdkMethod<Subscription['acceptedToken'], SubscriptionacceptedTokenArgs, MeshContext>,
  /** null **/
  acceptedTokens: InContextSdkMethod<Subscription['acceptedTokens'], SubscriptionacceptedTokensArgs, MeshContext>,
  /** null **/
  offer: InContextSdkMethod<Subscription['offer'], SubscriptionofferArgs, MeshContext>,
  /** null **/
  offers: InContextSdkMethod<Subscription['offers'], SubscriptionoffersArgs, MeshContext>,
  /** null **/
  trade: InContextSdkMethod<Subscription['trade'], SubscriptiontradeArgs, MeshContext>,
  /** null **/
  trades: InContextSdkMethod<Subscription['trades'], SubscriptiontradesArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["Hypercerts"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      ["graphUrl"]: Scalars['ID']
    };
}
