import { Client } from "urql/core";
import {
  ClaimsByOwnerQuery,
  ClaimByIdQuery,
  RecentClaimsQuery,
  ClaimTokensByOwnerQuery,
  ClaimTokensByClaimQuery,
  ClaimTokenByIdQuery,
} from "../indexer/gql/graphql";
export type QueryParams = {
  orderDirections: "asc" | "desc";
  skip: number;
  first: number;
  [key: string]: string | number | undefined;
};

export interface HypercertIndexerInterface {
  graphClient: Client;
  claimsByOwner: (owner: string, params?: QueryParams) => Promise<ClaimsByOwnerQuery | undefined>;
  claimById: (id: string) => Promise<ClaimByIdQuery | undefined>;
  firstClaims: (params?: QueryParams) => Promise<RecentClaimsQuery | undefined>;
  fractionsByOwner: (owner: string, params?: QueryParams) => Promise<ClaimTokensByOwnerQuery | undefined>;
  fractionsByClaim: (claimId: string, params?: QueryParams) => Promise<ClaimTokensByClaimQuery | undefined>;
  fractionById: (fractionId: string) => Promise<ClaimTokenByIdQuery | undefined>;
}
