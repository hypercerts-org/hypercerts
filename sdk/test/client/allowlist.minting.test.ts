import sinon from "sinon";
import { expect } from "@jest/globals";

import { HypercertClient } from "../../src";
import HypercertsStorage from "../../src/storage.js";
import { MalformedDataError, MintingError, TransferRestrictions } from "../../src/types";
import { getAllowlist, getFormattedMetadata, publicClient, walletClient } from "../helpers";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { encodeFunctionResult, isHex, parseAbi, stringToHex } from "viem";

const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

describe("Allows for minting claims from an allowlist", () => {
  const metaDataStub = sinon.stub(HypercertsStorage.prototype, "storeMetadata").resolves(mockCorrectMetadataCid);
  const dataStub = sinon.stub(HypercertsStorage.prototype, "storeData").resolves(mockCorrectMetadataCid);
  const wallet = walletClient;
  const userAddress = wallet.account.address;
  const client = new HypercertClient({
    id: 5,
    walletClient,
    publicClient,
  });

  const readSpy = sinon.stub(publicClient, "request");
  let writeSpy = sinon.stub(walletClient, "writeContract");

  const mintClaimFromAllowlistResult = encodeFunctionResult({
    abi: parseAbi(HypercertMinterAbi),
    functionName: "mintClaimFromAllowlist",
    result: [],
  });

  const batchMintClaimFromAllowlistResult = encodeFunctionResult({
    abi: parseAbi(HypercertMinterAbi),
    functionName: "batchMintClaimsFromAllowlists",
    result: [],
  });

  const mintClaimResult = encodeFunctionResult({
    abi: parseAbi(HypercertMinterAbi),
    functionName: "createAllowlist",
    result: [],
  });

  beforeEach(async () => {
    readSpy.resetBehavior();
    readSpy.resetHistory();

    writeSpy.resetBehavior();
    writeSpy.resetHistory();

    metaDataStub.resetHistory();
    dataStub.resetHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  describe("validations", () => {
    it("should create an allowlist", async () => {
      const { allowlist, totalUnits } = getAllowlist();
      const metaData = getFormattedMetadata();

      writeSpy = writeSpy.resolves(mintClaimResult);

      const hash = await client.createAllowlist(allowlist, metaData, totalUnits, TransferRestrictions.FromCreatorOnly);

      expect(isHex(hash)).toBeTruthy();
      expect(metaDataStub.callCount).toBe(1);
      expect(dataStub.callCount).toBe(1);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(1);
    });

    it("should not create an allowlist if the total units mismatch", async () => {
      const { allowlist, totalUnits } = getAllowlist();
      const metaData = getFormattedMetadata();

      let hash;
      try {
        hash = await client.createAllowlist(allowlist, metaData, totalUnits + 1n, TransferRestrictions.FromCreatorOnly);
      } catch (e) {
        expect(e instanceof MalformedDataError).toBeTruthy();

        const error = e as MalformedDataError;
        expect(error.message).toBe("Allowlist validation failed");
        expect(error.payload).toEqual({
          units: "Total units in allowlist must match total units [expected: 11, got: 10]",
        });
      }

      expect(hash).toBeUndefined();
      expect(metaDataStub.callCount).toBe(0);
      expect(dataStub.callCount).toBe(0);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(0);
      expect.assertions(8);
    });

    it("should not create an allowlist if the allowlist is empty", async () => {
      const { allowlist, totalUnits } = getAllowlist();
      const metaData = getFormattedMetadata();

      let hash;

      allowlist[0].units = 0n;

      try {
        hash = await client.createAllowlist(allowlist, metaData, totalUnits, TransferRestrictions.FromCreatorOnly);
      } catch (e) {
        expect(e instanceof MalformedDataError).toBeTruthy();

        const error = e as MalformedDataError;
        expect(error.message).toBe("Allowlist validation failed");
        expect(error.payload).toEqual({
          units: "Total units in allowlist must match total units [expected: 10, got: 9]",
        });
      }

      expect(hash).toBeUndefined();
      expect(metaDataStub.callCount).toBe(0);
      expect(dataStub.callCount).toBe(0);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(0);
      expect.assertions(8);
    });
  });

  describe("Mint single fraction", () => {
    it("should allow to mint a claim from an allowlist without the root", async () => {
      const { allowlist, merkleTree } = getAllowlist({ size: 1 });

      writeSpy = writeSpy.resolves(mintClaimFromAllowlistResult);

      const hash = await client.mintClaimFractionFromAllowlist(
        1n,
        allowlist[0].units,
        merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]) as `0x${string}`[],
      );

      expect(isHex(hash)).toBeTruthy();
      expect(metaDataStub.callCount).toBe(0);
      expect(dataStub.callCount).toBe(0);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(1);
      expect.assertions(5);
    });

    it("should allow to mint a claim from an allowlist with a correct root", async () => {
      const { allowlist, merkleTree } = getAllowlist({ size: 1, address: userAddress });

      writeSpy = writeSpy.resolves(mintClaimFromAllowlistResult);

      const hash = await client.mintClaimFractionFromAllowlist(
        1n,
        allowlist[0].units,
        merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]) as `0x${string}`[],
        merkleTree.root as `0x${string}`,
      );

      expect(isHex(hash)).toBeTruthy();
      expect(metaDataStub.callCount).toBe(0);
      expect(dataStub.callCount).toBe(0);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(1);
      expect.assertions(5);
    });

    it("should not allow to mint a claim from an allowlist with an incorrect root", async () => {
      const { allowlist, merkleTree } = getAllowlist({ size: 1, address: userAddress });

      const mockRoot = stringToHex("MOCK_ROOT", { size: 32 });

      let hash;
      try {
        hash = await client.mintClaimFractionFromAllowlist(
          1n,
          allowlist[0].units,
          merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]) as `0x${string}`[],
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

      expect(hash).toBeUndefined();
      expect(metaDataStub.callCount).toBe(0);
      expect(dataStub.callCount).toBe(0);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(0);
      expect.assertions(8);
    });
  });

  describe("Batch mint fractions", () => {
    it("should allow to batch mint a claim from an allowlist without the root", async () => {
      const firstList = getAllowlist({ size: 1 });
      const secondList = getAllowlist({ size: 1, units: 42n });

      writeSpy = writeSpy.resolves(batchMintClaimFromAllowlistResult);

      const firstProofs = firstList.merkleTree.getProof([
        firstList.allowlist[0].address,
        firstList.allowlist[0].units.toString(),
      ]);
      const secondProofs = secondList.merkleTree.getProof([
        secondList.allowlist[0].address,
        secondList.allowlist[0].units.toString(),
      ]);
      const hash = await client.batchMintClaimFractionsFromAllowlists(
        [1n, 2n],
        [firstList.allowlist[0].units, secondList.allowlist[0].units],
        [firstProofs, secondProofs] as `0x${string}`[][],
      );

      expect(isHex(hash)).toBeTruthy();
      expect(metaDataStub.callCount).toBe(0);
      expect(dataStub.callCount).toBe(0);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(1);
      expect.assertions(5);
    });

    it("should allow to mint a claim from an allowlist with a correct root", async () => {
      const firstList = getAllowlist({ size: 1, address: userAddress });
      const secondList = getAllowlist({ size: 1, units: 42n, address: userAddress });

      writeSpy = writeSpy.resolves(batchMintClaimFromAllowlistResult);

      const firstProofs = firstList.merkleTree.getProof([
        firstList.allowlist[0].address,
        firstList.allowlist[0].units.toString(),
      ]);
      const secondProofs = secondList.merkleTree.getProof([
        secondList.allowlist[0].address,
        secondList.allowlist[0].units.toString(),
      ]);
      const hash = await client.batchMintClaimFractionsFromAllowlists(
        [1n, 2n],
        [firstList.allowlist[0].units, secondList.allowlist[0].units],
        [firstProofs, secondProofs] as `0x${string}`[][],
        [firstList.merkleTree.root, secondList.merkleTree.root] as `0x${string}`[],
      );

      expect(isHex(hash)).toBeTruthy();
      expect(metaDataStub.callCount).toBe(0);
      expect(dataStub.callCount).toBe(0);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(1);
      expect.assertions(5);
    });

    it("should not allow to mint a claim from an allowlist with an incorrect root", async () => {
      const firstList = getAllowlist({ size: 1, address: userAddress });
      const secondList = getAllowlist({ size: 1, units: 42n, address: userAddress });

      writeSpy = writeSpy.resolves(batchMintClaimFromAllowlistResult);

      const firstProofs = firstList.merkleTree.getProof([
        firstList.allowlist[0].address,
        firstList.allowlist[0].units.toString(),
      ]);
      const secondProofs = secondList.merkleTree.getProof([
        secondList.allowlist[0].address,
        secondList.allowlist[0].units.toString(),
      ]);

      const mockRoot = stringToHex("MOCK_ROOT", { size: 32 });
      let hash;
      try {
        hash = await client.batchMintClaimFractionsFromAllowlists(
          [1n, 2n],
          [firstList.allowlist[0].units, secondList.allowlist[0].units],
          [firstProofs, secondProofs] as `0x${string}`[][],
          [firstList.merkleTree.root as `0x${string}`, mockRoot],
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

      expect(hash).toBeUndefined();
      expect(metaDataStub.callCount).toBe(0);
      expect(dataStub.callCount).toBe(0);
      expect(readSpy.callCount).toBe(0);
      expect(writeSpy.callCount).toBe(0);
      expect.assertions(8);
    });
  });
});
