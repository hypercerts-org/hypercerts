import {
  ClaimsByOwnerQuery,
  ClaimByIdQuery,
  RecentClaimsQuery,
  ClaimTokensByOwnerQuery,
  ClaimTokensByClaimQuery,
  ClaimTokenByIdQuery,
} from "../../.graphclient/index.js";
import { QueryParams } from "../index.js";

export interface HypercertIndexerInterface {
  graphClient: any;
  claimsByOwner: (owner: string, params?: QueryParams) => Promise<ClaimsByOwnerQuery>;
  claimById: (id: string) => Promise<ClaimByIdQuery>;
  firstClaims: (params?: QueryParams) => Promise<RecentClaimsQuery>;
  fractionsByOwner: (owner: string, params?: QueryParams) => Promise<ClaimTokensByOwnerQuery>;
  fractionsByClaim: (claimId: string, params?: QueryParams) => Promise<ClaimTokensByClaimQuery>;
  fractionById: (fractionId: string) => Promise<ClaimTokenByIdQuery>;
}
