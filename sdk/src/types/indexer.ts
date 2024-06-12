import { Client } from "urql/core";
import {
  HypercertsByOwnerQuery,
  HypercertsByOwnerQueryVariables,
  HypercertByIdQuery,
  HypercertByIdQueryVariables,
  RecentHypercertsQuery,
  RecentHypercertsQueryVariables,
  FractionsByOwnerQuery,
  FractionsByOwnerQueryVariables,
  FractionsByHypercertQuery,
  FractionsByHypercertQueryVariables,
  FractionByIdQueryVariables,
  FractionByIdQuery,
  MetadataByUriQuery,
  MetadataByUriQueryVariables,
  MetadataForHypercertQuery,
  MetadataForHypercertQueryVariables,
} from "../__generated__/gql/graphql";

export interface HypercertIndexerInterface {
  getGraphClient(): Client;
  hypercertsByOwner: (variables: HypercertsByOwnerQueryVariables) => Promise<HypercertsByOwnerQuery | undefined>;
  hypercertById: (variables: HypercertByIdQueryVariables) => Promise<HypercertByIdQuery | undefined>;
  recentHypercerts: (variables: RecentHypercertsQueryVariables) => Promise<RecentHypercertsQuery | undefined>;
  fractionsByOwner: (variables: FractionsByOwnerQueryVariables) => Promise<FractionsByOwnerQuery | undefined>;
  fractionById: (variables: FractionByIdQueryVariables) => Promise<FractionByIdQuery | undefined>;
  fractionsByHypercert: (
    variables: FractionsByHypercertQueryVariables,
  ) => Promise<FractionsByHypercertQuery | undefined>;
  metadataByUri: (variables: MetadataByUriQueryVariables) => Promise<MetadataByUriQuery | undefined>;
  metadataForHypercert: (
    variables: MetadataForHypercertQueryVariables,
  ) => Promise<MetadataForHypercertQuery | undefined>;
}
