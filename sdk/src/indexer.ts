import { getBuiltGraphSDK, Sdk as GraphClient } from "../.graphclient";
import { defaultQueryParams } from "./indexer/utils.js";
import { HypercertIndexerInterface, QueryParams } from "./types/index.js";

/**
 * A class that provides indexing functionality for Hypercerts.
 * @class HypercertIndexer
 */
export default class HypercertIndexer implements HypercertIndexerInterface {
  /** The Graph client used by the indexer. */
  private _graphClient: GraphClient;

  /**
   * Creates a new instance of the `HypercertIndexer` class.
   * @param options The configuration options for the indexer.
   */
  constructor(options: { graphUrl?: string }) {
    this._graphClient = getBuiltGraphSDK({
      graphUrl: options.graphUrl || "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-testnet",
    });
  }

  /**
   * Gets the Graph client used by the indexer.
   * @returns The Graph client.
   */
  get graphClient(): GraphClient {
    return this._graphClient;
  }

  /**
   * Gets the claims owned by a given address.
   * @param owner The address of the owner.
   * @param params The query parameters.
   * @returns A Promise that resolves to the claims.
   */
  claimsByOwner = async (owner: string, params: QueryParams = defaultQueryParams) =>
    this.graphClient.ClaimsByOwner({
      owner,
      ...params,
    });

  /**
   * Gets a claim by its ID.
   * @param id The ID of the claim.
   * @returns A Promise that resolves to the claim.
   */
  claimById = async (id: string) =>
    this.graphClient.ClaimById({
      id,
    });

  /**
   * Gets the most recent claims.
   * @param params The query parameters.
   * @returns A Promise that resolves to the claims.
   */
  firstClaims = async (params: QueryParams = defaultQueryParams) =>
    this.graphClient.RecentClaims({
      ...params,
    });

  /**
   * Gets the claim tokens owned by a given address.
   * @param owner The address of the owner.
   * @param params The query parameters.
   * @returns A Promise that resolves to the claim tokens.
   */
  fractionsByOwner = async (owner: string, params: QueryParams = defaultQueryParams) =>
    this.graphClient.ClaimTokensByOwner({
      owner,
      ...params,
    });

  /**
   * Gets the claim tokens for a given claim.
   * @param claimId The ID of the claim.
   * @param params The query parameters.
   * @returns A Promise that resolves to the claim tokens.
   */
  fractionsByClaim = async (claimId: string, params: QueryParams = defaultQueryParams) =>
    this.graphClient.ClaimTokensByClaim({
      claimId,
      ...params,
    });

  /**
   * Gets a claim token by its ID.
   * @param fractionId The ID of the claim token.
   * @returns A Promise that resolves to the claim token.
   */
  fractionById = async (fractionId: string) =>
    this.graphClient.ClaimTokenById({
      claimTokenId: fractionId,
    });
}
