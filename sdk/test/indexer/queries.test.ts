import { describe, it, beforeEach, afterEach, afterAll, vi, expect } from "vitest";

import { HypercertIndexer } from "../../src/indexer";

export const defaultQueryParams = {
  orderDirections: "desc",
  skip: 0,
  first: 100,
};

describe("HypercertIndexer", () => {
  let indexer: HypercertIndexer;

  beforeEach(() => {
    indexer = new HypercertIndexer({ graphUrl: "http://exampe.com", environment: "test" });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  it("should call graphClient.hypercertsByOwner with the correct parameters", async () => {
    const owner = "0x1234567890123456789012345678901234567890";
    const params = defaultQueryParams;
    const mockResponse = {
      hypercerts: {
        count: 1,
        data: [
          {
            hypercert_id: "1",
          },
        ],
      },
    };

    const spy = vi.spyOn(indexer, "hypercertsByOwner").mockResolvedValue(mockResponse);

    const result = await indexer.hypercertsByOwner({ owner, ...params });

    expect(spy).toHaveBeenCalledWith({ owner, ...params });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should call graphClient.hypercertById with the correct parameters", async () => {
    const id = "0x1234567890123456789012345678901234567890123456789012345678901234";
    const mockResponse = {
      hypercerts: {
        count: 1,
        data: [
          {
            hypercert_id: "1",
          },
        ],
      },
    };

    const spy = vi.spyOn(indexer, "hypercertById").mockResolvedValue(mockResponse);

    const result = await indexer.hypercertById({ id });

    expect(spy).toHaveBeenCalledWith({ id });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should call graphClient.recentHypercerts with the correct parameters", async () => {
    const params = defaultQueryParams;
    const mockResponse = {
      hypercerts: {
        count: 1,
        data: [
          {
            hypercert_id: "1",
          },
        ],
      },
    };

    const spy = vi.spyOn(indexer, "recentHypercerts").mockResolvedValue(mockResponse);

    const result = await indexer.recentHypercerts(params);

    expect(spy).toHaveBeenCalledWith(params);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should call graphClient.FractionByOwner with the correct parameters", async () => {
    const owner = "0x1234567890123456789012345678901234567890";
    const params = defaultQueryParams;
    const mockResponse = {
      fractions: {
        count: 1,
        data: [
          {
            hypercert_id: "1",
          },
        ],
      },
    };

    const spy = vi.spyOn(indexer, "fractionsByOwner").mockResolvedValue(mockResponse);

    const result = await indexer.fractionsByOwner({ owner, ...params });

    expect(spy).toHaveBeenCalledWith({ owner, ...params });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  it("should call graphClient.fractionsByHypercert with the correct parameters", async () => {
    const hypercertId = "0x1234567890123456789012345678901234567890123456789012345678901234";
    const params = defaultQueryParams;
    const mockResponse = {
      hypercerts: {
        count: 1,
        data: [
          {
            hypercert_id: "1",
          },
        ],
      },
    };

    const spy = vi.spyOn(indexer, "fractionsByHypercert").mockResolvedValue(mockResponse);

    const result = await indexer.fractionsByHypercert({ hypercertId, ...params });

    expect(spy).toHaveBeenCalledWith({ hypercertId, ...params });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });
});
