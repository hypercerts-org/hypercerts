import { jest } from "@jest/globals";
import { MockContract, MockProvider, deployMockContract } from "ethereum-waffle";

import { HypercertClient, HypercertMinterABI } from "../../src/index.js";
import HypercertsStorage from "../../src/storage.js";
import {
  HypercertMetadata,
  HypercertMinter,
  MalformedDataError,
  MintingError,
  TransferRestrictions,
} from "../../src/types/index.js";
import { getAllowlist, getFormattedMetadata } from "../helpers.js";
import { BigNumber, ethers } from "ethers";
import { mock } from "node:test";

const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

const mockStoreMetadata = jest
  .spyOn(HypercertsStorage.prototype, "storeMetadata")
  .mockImplementation(async (data: HypercertMetadata) => Promise.resolve(mockCorrectMetadataCid));

const mockStoreData = jest
  .spyOn(HypercertsStorage.prototype, "storeData")
  .mockImplementation(async (data) => Promise.resolve(mockCorrectMetadataCid));

describe("Allows for minting claims from an allowlist", () => {
  const setUp = async () => {
    const provider = new MockProvider();
    const [user, other, admin] = provider.getWallets();
    const minter = await deployMockContract(user, HypercertMinterABI);

    const client = new HypercertClient({
      chainId: 5,
      provider,
      signer: user,
      contractAddress: minter.address,
    });

    return {
      client,
      provider,
      users: { user, other, admin },
      minter,
    };
  };

  let _client: HypercertClient;
  let _provider: MockProvider;
  let _users: { user: any; other: any; admin: any };
  let _minter: MockContract;

  beforeAll(async () => {
    const { client, provider, users, minter } = await setUp();
    _client = client;
    _provider = provider;
    _users = users;
    _minter = minter;
  });

  beforeEach(() => {
    _provider.clearCallHistory();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should create an allowlist", async () => {
    const { allowlist, totalUnits } = getAllowlist();
    const metaData = getFormattedMetadata();

    await _minter.mock.createAllowlist.returns();
    await _client.createAllowlist(allowlist, metaData, totalUnits, TransferRestrictions.FromCreatorOnly);

    expect(mockStoreData).toHaveBeenCalledTimes(1);

    expect(mockStoreMetadata).toHaveBeenCalledTimes(1);

    expect(_provider.callHistory.length).toBe(2);
  }, 10000);

  it("should not create an allowlist if the total units mismatch", async () => {
    const { allowlist, totalUnits } = getAllowlist();
    const metaData = getFormattedMetadata();

    try {
      await _client.createAllowlist(allowlist, metaData, totalUnits.add(1), TransferRestrictions.FromCreatorOnly);
    } catch (e) {
      expect(e instanceof MalformedDataError).toBeTruthy();

      const error = e as MalformedDataError;
      expect(error.message).toBe("Allowlist validation failed");
      expect(error.payload).toEqual({
        units: "Total units in allowlist must match total units [expected: 11, got: 10]",
      });
    }
  });

  it("should not create an allowlist if the allowlist is empty", async () => {
    const { allowlist, totalUnits } = getAllowlist({ size: 1 });
    const metaData = getFormattedMetadata();

    allowlist[0].units = BigNumber.from(0);

    try {
      await _client.createAllowlist(allowlist, metaData, totalUnits, TransferRestrictions.FromCreatorOnly);
    } catch (e) {
      expect(e instanceof MalformedDataError).toBeTruthy();

      const error = e as MalformedDataError;
      expect(error.message).toBe("Allowlist validation failed");
      expect(error.payload).toEqual({ units: "Total units in allowlist must be greater than 0" });
    }
  });

  it("should allow to mint a claim from an allowlist without the root", async () => {
    const { allowlist, merkleTree } = getAllowlist({ size: 1 });

    await _minter.mock.mintClaimFromAllowlist.returns();

    await _client.mintClaimFractionFromAllowlist(
      1,
      allowlist[0].units,
      merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]),
    );

    expect(_provider.callHistory.length).toBe(2);
  });

  it("should allow to mint a claim from an allowlist with a correct root", async () => {
    const { allowlist, merkleTree } = getAllowlist({ size: 1, address: _users.user.address });

    await _minter.mock.mintClaimFromAllowlist.returns();

    await _client.mintClaimFractionFromAllowlist(
      1,
      allowlist[0].units,
      merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]),
      merkleTree.root,
    );

    expect(_provider.callHistory.length).toBe(2);
  });

  it("should not allow to mint a claim from an allowlist with an incorrect root", async () => {
    const { allowlist, merkleTree } = getAllowlist({ size: 1, address: _users.user.address });

    const mockRoot = ethers.utils.formatBytes32String("MOCK_ROOT");
    try {
      await _client.mintClaimFractionFromAllowlist(
        1,
        allowlist[0].units,
        merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]),
        mockRoot,
      );
    } catch (e) {
      console.log(e);

      expect(e instanceof MintingError).toBeTruthy();

      const error = e as MintingError;
      expect(error.message).toBe("Merkle proof verification failed");
      expect(error.payload).toEqual({
        root: mockRoot,
        proof: merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]),
      });
    }

    expect(_provider.callHistory.length).toBe(0);
  });
});
