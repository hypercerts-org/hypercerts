import {
  ClaimsByOwnerQuery,
  ClaimByIdQuery,
  RecentClaimsQuery,
  ClaimTokensByOwnerQuery,
  ClaimTokensByClaimQuery,
  ClaimTokenByIdQuery,
} from "../../.graphclient/index.js";

export type QueryParams = {
  orderDirections: "asc" | "desc";
  skip: number;
  first: number;
  [key: string]: any;
};

export interface HypercertIndexerInterface {
  graphClient: any;
  claimsByOwner: (owner: string, params?: QueryParams) => Promise<ClaimsByOwnerQuery>;
  claimById: (id: string) => Promise<ClaimByIdQuery>;
  firstClaims: (params?: QueryParams) => Promise<RecentClaimsQuery>;
  fractionsByOwner: (owner: string, params?: QueryParams) => Promise<ClaimTokensByOwnerQuery>;
  fractionsByClaim: (claimId: string, params?: QueryParams) => Promise<ClaimTokensByClaimQuery>;
  fractionById: (fractionId: string) => Promise<ClaimTokenByIdQuery>;
}
