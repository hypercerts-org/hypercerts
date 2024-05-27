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
} from "../indexer/gql/graphql";

export interface HypercertIndexerInterface {
  getGraphClient(): Client;
  hypercertsByOwner: (variables: HypercertsByOwnerQueryVariables) => Promise<HypercertsByOwnerQuery | undefined>;
  hypercertById: (variables: HypercertByIdQueryVariables) => Promise<HypercertByIdQuery | undefined>;
  recentHypercerts: (variables: RecentHypercertsQueryVariables) => Promise<RecentHypercertsQuery | undefined>;
  fractionsByOwner: (variables: FractionsByOwnerQueryVariables) => Promise<FractionsByOwnerQuery | undefined>;
  fractionsByHypercert: (
    variables: FractionsByHypercertQueryVariables,
  ) => Promise<FractionsByHypercertQuery | undefined>;
}
