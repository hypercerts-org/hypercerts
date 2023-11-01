import { MockContract, MockProvider, deployMockContract } from "ethereum-waffle";
import { BigNumber, ethers } from "ethers";
import sinon from "sinon";
import { expect } from "@jest/globals";

import { HypercertClient } from "../../src";
import HypercertsStorage from "../../src/storage";
import { MalformedDataError, MintingError, TransferRestrictions } from "../../src/types";
import { getAllowlist, getFormattedMetadata } from "../helpers";
import { HypercertMinter, HypercertMinterAbi } from "@hypercerts-org/contracts";
const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

describe("Allows for minting claims from an allowlist", () => {
  const metaDataStub = sinon.stub(HypercertsStorage.prototype, "storeMetadata").resolves(mockCorrectMetadataCid);
  const dataStub = sinon.stub(HypercertsStorage.prototype, "storeData").resolves(mockCorrectMetadataCid);

  const setUp = async () => {
    const provider = new MockProvider();
    const [user, other, admin] = provider.getWallets();
    const stub = sinon.stub(provider, "on");

    const minter = await deployMockContract(user, HypercertMinterAbi);

    const client = new HypercertClient({
      chainId: 5,
      operator: user,
    });

    sinon.replaceGetter(client, "contract", () => minter as unknown as HypercertMinter);

    return {
      client,
      provider,
      users: { user, other, admin },
      minter,
      stub,
    };
  };

  let _client: HypercertClient;
  let _provider: MockProvider;
  let _users: { user: ethers.Wallet; other: ethers.Wallet; admin: ethers.Wallet };
  let _minter: MockContract;
  let _stub: sinon.SinonStub;

  beforeAll(async () => {
    const { client, provider, users, minter, stub } = await setUp();
    _client = client;
    _provider = provider;
    _users = users;
    _minter = minter;
    _stub = stub;
  });

  beforeEach(() => {
    _provider.clearCallHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  describe("validations", () => {
    it("should create an allowlist", async () => {
      const { allowlist, totalUnits } = getAllowlist();
      const metaData = getFormattedMetadata();

      await _minter.mock.createAllowlist.returns();
      const res = await _client.createAllowlist(allowlist, metaData, totalUnits, TransferRestrictions.FromCreatorOnly);

      sinon.assert.calledOnce(metaDataStub);
      sinon.assert.calledOnce(dataStub);

      expect(res.chainId).toBe(1337);
      expect(_provider.callHistory.length).toBe(2);
    });

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

      expect(_provider.callHistory.length).toBe(0);
      expect.assertions(4);
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

      expect(_provider.callHistory.length).toBe(0);
      expect.assertions(4);
    });
  });

  describe("Mint single fraction", () => {
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
      const { allowlist, merkleTree } = getAllowlist({ size: 1, address: _users.user.address as `0x${string}` });

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
      const { allowlist, merkleTree } = getAllowlist({ size: 1, address: _users.user.address as `0x${string}` });

      const mockRoot = ethers.utils.formatBytes32String("MOCK_ROOT");
      try {
        await _client.mintClaimFractionFromAllowlist(
          1,
          allowlist[0].units,
          merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]),
          mockRoot,
        );
      } catch (e) {
        expect(e instanceof MintingError).toBeTruthy();

        const error = e as MintingError;
        expect(error.message).toBe("Merkle proof verification failed");
        expect(error.payload).toEqual({
          root: mockRoot,
          proof: merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]),
        });
      }

      expect(_provider.callHistory.length).toBe(0);
      expect.assertions(4);
    });
  });

  describe("Batch mint fractions", () => {
    it("should allow to batch mint a claim from an allowlist without the root", async () => {
      const firstList = getAllowlist({ size: 1 });
      const secondList = getAllowlist({ size: 1, units: 42 });

      await _minter.mock.batchMintClaimsFromAllowlists.returns();

      const firstProofs = firstList.merkleTree.getProof([
        firstList.allowlist[0].address,
        firstList.allowlist[0].units.toString(),
      ]);
      const secondProofs = secondList.merkleTree.getProof([
        secondList.allowlist[0].address,
        secondList.allowlist[0].units.toString(),
      ]);
      await _client.batchMintClaimFractionsFromAllowlists(
        [1, 2],
        [firstList.allowlist[0].units, secondList.allowlist[0].units],
        [firstProofs, secondProofs],
      );

      expect(_provider.callHistory.length).toBe(2);
    });

    it("should allow to mint a claim from an allowlist with a correct root", async () => {
      const firstList = getAllowlist({ size: 1, address: _users.user.address as `0x${string}` });
      const secondList = getAllowlist({ size: 1, units: 42, address: _users.user.address as `0x${string}` });

      await _minter.mock.batchMintClaimsFromAllowlists.returns();

      const firstProofs = firstList.merkleTree.getProof([
        firstList.allowlist[0].address,
        firstList.allowlist[0].units.toString(),
      ]);
      const secondProofs = secondList.merkleTree.getProof([
        secondList.allowlist[0].address,
        secondList.allowlist[0].units.toString(),
      ]);
      await _client.batchMintClaimFractionsFromAllowlists(
        [1, 2],
        [firstList.allowlist[0].units, secondList.allowlist[0].units],
        [firstProofs, secondProofs],
        [firstList.merkleTree.root, secondList.merkleTree.root],
      );

      expect(_provider.callHistory.length).toBe(2);
    });

    it("should not allow to mint a claim from an allowlist with an incorrect root", async () => {
      const firstList = getAllowlist({ size: 1, address: _users.user.address as `0x${string}` });
      const secondList = getAllowlist({ size: 1, units: 42, address: _users.user.address as `0x${string}` });

      await _minter.mock.batchMintClaimsFromAllowlists.returns();

      const firstProofs = firstList.merkleTree.getProof([
        firstList.allowlist[0].address,
        firstList.allowlist[0].units.toString(),
      ]);
      const secondProofs = secondList.merkleTree.getProof([
        secondList.allowlist[0].address,
        secondList.allowlist[0].units.toString(),
      ]);

      const mockRoot = ethers.utils.formatBytes32String("MOCK_ROOT");
      try {
        await _client.batchMintClaimFractionsFromAllowlists(
          [1, 2],
          [firstList.allowlist[0].units, secondList.allowlist[0].units],
          [firstProofs, secondProofs],
          [firstList.merkleTree.root, mockRoot],
        );
      } catch (e) {
        expect(e instanceof MintingError).toBeTruthy();

        const error = e as MintingError;
        expect(error.message).toBe("Merkle proof verification failed");
        expect(error.payload).toEqual({
          root: mockRoot,
          proof: secondProofs,
        });
      }

      // Signer getAddress
      expect(_provider.callHistory.length).toBe(1);
    });
  });
});
