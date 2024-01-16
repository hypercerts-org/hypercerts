import { describe, it, afterEach, afterAll, vi, expect } from "vitest";

import { HypercertsStorage } from "../../src/storage";
import { MalformedDataError } from "../../src/types/errors";
import { mockDataSets } from "../helpers";
import sinon from "sinon";

const mocks = vi.hoisted(() => {
  return {
    uploadMetadata: vi.fn(),
  };
});

vi.mock("../../src/utils/apis", () => {
  return {
    uploadMetadata: mocks.uploadMetadata,
  };
});

describe("Storage - store metadata", () => {
  const { hypercertMetadata } = mockDataSets;

  const storage = new HypercertsStorage();

  afterEach(() => {
    vi.clearAllMocks();
    sinon.restore();
  });

  afterAll(() => {
    vi.resetAllMocks();
    sinon.resetBehavior();
  });

  it("Store metadata", async () => {
    mocks.uploadMetadata.mockResolvedValue({ data: { cid: hypercertMetadata.cid } });
    const res = await storage.storeMetadata(hypercertMetadata.data);
    expect(res).to.eq(hypercertMetadata.cid);
    expect(mocks.uploadMetadata).toHaveBeenCalledTimes(1);
  });

  it("Throws when trying to store incorrect metadata", async () => {
    const _metadata = {
      ...hypercertMetadata.data,
      name: undefined,
    };

    // storeData
    try {
      await storage.storeMetadata(_metadata);
    } catch (e) {
      expect(e).to.be.an.instanceOf(MalformedDataError);

      const error = e as MalformedDataError;
      expect(error.message).to.eq("Invalid metadata.");
    }

    expect(mocks.uploadMetadata).toHaveBeenCalledTimes(0);
  });
});
