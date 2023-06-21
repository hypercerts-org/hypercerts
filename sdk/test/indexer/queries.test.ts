import HypercertIndexer from "../../src/indexer.js";
import {
  ClaimsByOwnerQuery,
  ClaimByIdQuery,
  RecentClaimsQuery,
  ClaimTokensByOwnerQuery,
  ClaimTokensByClaimQuery,
  ClaimTokenByIdQuery,
  Sdk,
} from "../../.graphclient/index.js";
import { defaultQueryParams } from "../../src/indexer/utils.js";
import { jest } from "@jest/globals";

describe("HypercertIndexer", () => {
  let indexer: HypercertIndexer;

  beforeEach(() => {
    jest.clearAllMocks();
    indexer = new HypercertIndexer({ graphName: "hypercerts-testnet" });
  });

  it("should call graphClient.ClaimsByOwner with the correct parameters", async () => {
    const owner = "0x1234567890123456789012345678901234567890";
    const params = defaultQueryParams;
    const mockResponse: ClaimsByOwnerQuery = { claims: [] };

    let spy = jest.spyOn(indexer, "claimsByOwner").mockResolvedValue(mockResponse);

    const result = await indexer.claimsByOwner(owner, params);

    expect(spy).toHaveBeenCalledWith(owner, params);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ claims: [] });
  });

  it("should call graphClient.ClaimById with the correct parameters", async () => {
    const id = "0x1234567890123456789012345678901234567890123456789012345678901234";
    const mockResponse: ClaimByIdQuery = { claim: null };

    let spy = jest.spyOn(indexer, "claimById").mockResolvedValue(mockResponse);

    const result = await indexer.claimById(id);

    expect(spy).toHaveBeenCalledWith(id);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should call graphClient.RecentClaims with the correct parameters", async () => {
    const params = defaultQueryParams;
    const mockResponse: RecentClaimsQuery = { claims: [] };

    let spy = jest.spyOn(indexer, "firstClaims").mockResolvedValue(mockResponse);

    const result = await indexer.firstClaims(params);

    expect(spy).toHaveBeenCalledWith(params);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should call graphClient.ClaimTokensByOwner with the correct parameters", async () => {
    const owner = "0x1234567890123456789012345678901234567890";
    const params = defaultQueryParams;
    const mockResponse: ClaimTokensByOwnerQuery = { claimTokens: [] };

    let spy = jest.spyOn(indexer, "fractionsByOwner").mockResolvedValue(mockResponse);

    const result = await indexer.fractionsByOwner(owner, params);

    expect(spy).toHaveBeenCalledWith(owner, params);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should call graphClient.ClaimTokensByClaim with the correct parameters", async () => {
    const claimId = "0x1234567890123456789012345678901234567890123456789012345678901234";
    const params = defaultQueryParams;
    const mockResponse: ClaimTokensByClaimQuery = { claimTokens: [] };

    let spy = jest.spyOn(indexer, "fractionsByClaim").mockResolvedValue(mockResponse);

    const result = await indexer.fractionsByClaim(claimId, params);

    expect(spy).toHaveBeenCalledWith(claimId, params);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should call graphClient.ClaimTokenById with the correct parameters", async () => {
    const fractionId = "0x1234567890123456789012345678901234567890123456789012345678901234";
    const mockResponse: ClaimTokenByIdQuery = { claimToken: null };

    let spy = jest.spyOn(indexer, "fractionById").mockResolvedValue(mockResponse);

    const result = await indexer.fractionById(fractionId);
    expect(spy).toHaveBeenCalledWith(fractionId);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });
});
