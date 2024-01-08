import { describe, it, afterEach, afterAll, vi, expect } from "vitest";

import { HypercertsStorage } from "../../src/storage";
import { MalformedDataError } from "../../src/types/errors";
import { mockDataSets } from "../helpers";
import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { AllowlistEntry } from "src";

const mocks = vi.hoisted(() => {
  return {
    uploadAllowlist: vi.fn(),
  };
});

vi.mock("../../src/utils/apis", () => {
  return {
    uploadAllowlist: mocks.uploadAllowlist,
  };
});

describe("Storage - store allowlist", () => {
  const { someData } = mockDataSets;

  const storage = new HypercertsStorage();

  afterEach(() => {
    vi.clearAllMocks();
    sinon.restore();
  });

  afterAll(() => {
    vi.resetAllMocks();
    sinon.resetBehavior();
  });

  it("Store allowlist", async () => {
    const allowList = [
      {
        address: faker.finance.ethereumAddress(),
        units: BigInt(100),
      },
    ];

    mocks.uploadAllowlist.mockResolvedValue({ cid: someData.cid });
    const res = await storage.storeAllowList(allowList, 100n);
    expect(res).to.eq(someData.cid);
    expect(mocks.uploadAllowlist).toHaveBeenCalledTimes(1);
  });

  it("Throws when trying to store incorrect allowList", async () => {
    const allowList = [
      {
        address: faker.finance.ethereumAddress(),
        units: 50n,
      },
    ];

    // storeData
    try {
      await storage.storeAllowList(allowList as unknown as AllowlistEntry[], 100n);
    } catch (e) {
      expect(e).to.be.an.instanceOf(MalformedDataError);

      const error = e as MalformedDataError;
      expect(error.message).to.eq("Invalid allowList.");
    }

    expect(mocks.uploadAllowlist).toHaveBeenCalledTimes(0);
  });
});
