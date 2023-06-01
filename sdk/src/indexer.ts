import { getBuiltGraphSDK } from "../.graphclient/index.js";
import { defaultQueryParams } from "./indexer/utils.js";
import { HypercertIndexerInterface, QueryParams } from "./types/index.js";

export default class HypercertIndexer implements HypercertIndexerInterface {
  private _graphClient;
  constructor({ graphName }: { graphName?: string }) {
    this._graphClient = getBuiltGraphSDK({ chainName: graphName || "hypercerts-testnet" });
  }

  get graphClient() {
    return this._graphClient;
  }

  claimsByOwner = async (owner: string, params: QueryParams = defaultQueryParams) =>
    this.graphClient.ClaimsByOwner({
      owner,
      ...params,
    });

  claimById = async (id: string) =>
    this.graphClient.ClaimById({
      id,
    });

  firstClaims = async (params: QueryParams = defaultQueryParams) =>
    this.graphClient.RecentClaims({
      ...params,
    });

  fractionsByOwner = async (owner: string, params: QueryParams = defaultQueryParams) =>
    this.graphClient.ClaimTokensByOwner({
      owner,
      ...params,
    });

  fractionsByClaim = async (claimId: string, params: QueryParams = defaultQueryParams) =>
    this.graphClient.ClaimTokensByClaim({
      claimId,
      ...params,
    });

  fractionById = async (fractionId: string) =>
    this.graphClient.ClaimTokenById({
      claimTokenId: fractionId,
    });
}
