import { describe, it, afterEach, afterAll, vi, expect } from "vitest";

import { mockDataSets } from "../helpers";
import sinon from "sinon";
import { faker } from "@faker-js/faker";
import { getStorage } from "../../src/storage";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const mocks = vi.hoisted(() => {
  return {
    storeAllowList: vi.fn(),
  };
});

vi.mock("../../src/__generated__/api", () => {
  return {
    storeAllowList: mocks.storeAllowList,
  };
});

describe("Storage - store allowlist", () => {
  const { someData } = mockDataSets;

  const storage = getStorage({ environment: "test" });

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

    const tree = StandardMerkleTree.of(
      allowList.map((p) => [p.address, p.units.toString()]),
      ["address", "uint256"],
    );

    mocks.storeAllowList.mockResolvedValue({ cid: someData.cid });
    const res = await storage.storeAllowlist({ allowList: JSON.stringify(tree.dump()), totalUnits: "100" });
    expect(res).to.deep.eq({ cid: someData.cid });
    expect(mocks.storeAllowList).toHaveBeenCalledTimes(1);
  });
});
