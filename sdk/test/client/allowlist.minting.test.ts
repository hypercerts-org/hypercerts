import { jest } from "@jest/globals";
import { MockProvider, deployMockContract } from "ethereum-waffle";

import { HypercertClient, HypercertMinterABI } from "../../src/index.js";
import HypercertsStorage from "../../src/storage.js";
import { TransferRestrictions } from "../../src/types/index.js";
import { getAllowlist, getFormattedMetadata } from "../helpers.js";

const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

describe("Allows for minting claims from an allowlist", () => {
  const setUp = async () => {
    const provider = new MockProvider();
    const [user, other, admin] = provider.getWallets();
    const minter = await deployMockContract(user, HypercertMinterABI);

    return { provider, users: { user, other, admin }, minter };
  };

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should create an allowlist", async () => {
    const {
      provider,
      users: { user },
      minter,
    } = await setUp();

    const client = new HypercertClient({
      chainId: 5,
      provider,
      signer: user.connect(provider),
      contractAddress: minter.address,
    });

    const { allowlist, totalUnits } = getAllowlist();
    const metaData = getFormattedMetadata();

    const storeMetadataMock = jest
      .spyOn(HypercertsStorage.prototype, "storeMetadata")
      .mockResolvedValue(mockCorrectMetadataCid);

    const storeDataMock = jest
      .spyOn(HypercertsStorage.prototype, "storeData")
      .mockResolvedValue(mockCorrectMetadataCid);

    await minter.mock.createAllowlist.returns();
    await client.createAllowlist(allowlist, metaData, totalUnits, TransferRestrictions.FromCreatorOnly);

    await expect(storeDataMock).toHaveBeenCalledTimes(1);

    await expect(storeMetadataMock).toHaveBeenCalledTimes(1);

    // await expect(storeWeb3StorageMock).toHaveBeenCalledTimes(1);
    await expect(provider.callHistory.length).toBe(3);
  }, 20000);
});
