import { describe, it, afterEach, afterAll, vi, expect } from "vitest";

import { mockDataSets } from "../helpers";
import sinon from "sinon";
import { getStorage } from "../../src/storage";

const mocks = vi.hoisted(() => {
  return {
    storeMetadata: vi.fn(),
  };
});

vi.mock("../../src/__generated__/api", () => {
  return {
    storeMetadata: mocks.storeMetadata,
  };
});

describe("Storage - store metadata", () => {
  const { hypercertMetadata } = mockDataSets;

  const storage = getStorage({ environment: "test" });

  afterEach(() => {
    vi.clearAllMocks();
    sinon.restore();
  });

  afterAll(() => {
    vi.resetAllMocks();
    sinon.resetBehavior();
  });

  it("Store metadata", async () => {
    mocks.storeMetadata.mockResolvedValue({ cid: hypercertMetadata.cid });
    const res = await storage.storeMetadata(hypercertMetadata.data);
    expect(res).to.deep.eq({ cid: hypercertMetadata.cid });
    expect(mocks.storeMetadata).toHaveBeenCalledTimes(1);
  });
});
