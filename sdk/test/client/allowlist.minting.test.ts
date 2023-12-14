import { describe, it, beforeEach, afterAll } from "vitest";
import chai, { expect } from "chai";
import assertionsCount from "chai-assertions-count";

import sinon from "sinon";

import { HypercertClient, HypercertsStorage } from "../../src";
import { MalformedDataError, MintingError, TransferRestrictions } from "../../src/types";
import { getAllowlist, getFormattedMetadata, publicClient, walletClient, mockDataSets } from "../helpers";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { encodeFunctionResult, isHex, stringToHex } from "viem";

chai.use(assertionsCount);

describe("Allows for minting claims from an allowlist", () => {
  const { hypercertData, hypercertMetadata } = mockDataSets;
  const metaDataStub = sinon.stub(HypercertsStorage.prototype, "storeMetadata").resolves(hypercertMetadata.cid);
  const dataStub = sinon.stub(HypercertsStorage.prototype, "storeData").resolves(hypercertData.cid);
  const wallet = walletClient;
  const userAddress = wallet.account?.address;
  const client = new HypercertClient({
    chain: { id: 5 },
    walletClient,
    publicClient,
    nftStorageToken: "test",
    web3StorageToken: "test",
  });

  const readSpy = sinon.stub(publicClient, "readContract");
  let writeSpy = sinon.stub(walletClient, "writeContract");

  const mintClaimFromAllowlistResult = encodeFunctionResult({
    abi: HypercertMinterAbi,
    functionName: "mintClaimFromAllowlist",
    result: [],
  });

  const batchMintClaimFromAllowlistResult = encodeFunctionResult({
    abi: HypercertMinterAbi,
    functionName: "batchMintClaimsFromAllowlists",
    result: [],
  });

  const mintClaimResult = encodeFunctionResult({
    abi: HypercertMinterAbi,
    functionName: "createAllowlist",
    result: [],
  });

  beforeEach(async () => {
    chai.Assertion.resetAssertsCheck();

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

      expect(isHex(hash)).to.be.true;
      expect(metaDataStub.callCount).to.eq(1);
      expect(dataStub.callCount).to.eq(1);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("should not create an allowlist if the total units mismatch", async () => {
      chai.Assertion.expectAssertions(8);
      const { allowlist, totalUnits } = getAllowlist();
      const metaData = getFormattedMetadata();

      let hash;
      try {
        hash = await client.createAllowlist(allowlist, metaData, totalUnits + 1n, TransferRestrictions.FromCreatorOnly);
      } catch (e) {
        expect(e).to.be.instanceOf(MalformedDataError);

        const error = e as MalformedDataError;
        expect(error.message).to.be.eq("Allowlist validation failed");
        expect(error.payload).to.deep.eq({
          units: "Total units in allowlist must match total units [expected: 11, got: 10]",
        });
      }

      expect(hash).to.be.undefined;
      expect(metaDataStub.callCount).to.eq(0);
      expect(dataStub.callCount).to.eq(0);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(0);
    });

    it("should not create an allowlist if the allowlist is empty", async () => {
      chai.Assertion.expectAssertions(8);
      const { allowlist, totalUnits } = getAllowlist();
      const metaData = getFormattedMetadata();

      let hash;

      allowlist[0].units = 0n;

      try {
        hash = await client.createAllowlist(allowlist, metaData, totalUnits, TransferRestrictions.FromCreatorOnly);
      } catch (e) {
        expect(e).to.be.instanceOf(MalformedDataError);

        const error = e as MalformedDataError;
        expect(error.message).to.be.eq("Allowlist validation failed");
        expect(error.payload).to.deep.eq({
          units: "Total units in allowlist must match total units [expected: 10, got: 9]",
        });
      }

      expect(hash).to.be.undefined;
      expect(metaDataStub.callCount).to.eq(0);
      expect(dataStub.callCount).to.eq(0);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(0);
    });
  });

  describe("Mint single fraction", () => {
    it("should allow to mint a claim from an allowlist without the root", async () => {
      chai.Assertion.expectAssertions(5);
      const { allowlist, merkleTree } = getAllowlist({ size: 1 });

      writeSpy = writeSpy.resolves(mintClaimFromAllowlistResult);

      const hash = await client.mintClaimFractionFromAllowlist(
        1n,
        allowlist[0].units,
        merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]) as `0x${string}`[],
      );

      expect(isHex(hash)).to.be.true;
      expect(metaDataStub.callCount).to.eq(0);
      expect(dataStub.callCount).to.eq(0);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("should allow to mint a claim from an allowlist with a correct root", async () => {
      chai.Assertion.expectAssertions(5);
      const { allowlist, merkleTree } = getAllowlist({ size: 1, address: userAddress });

      writeSpy = writeSpy.resolves(mintClaimFromAllowlistResult);

      const hash = await client.mintClaimFractionFromAllowlist(
        1n,
        allowlist[0].units,
        merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]) as `0x${string}`[],
        merkleTree.root as `0x${string}`,
      );

      expect(isHex(hash)).to.be.true;
      expect(metaDataStub.callCount).to.eq(0);
      expect(dataStub.callCount).to.eq(0);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("should not allow to mint a claim from an allowlist with an incorrect root", async () => {
      chai.Assertion.expectAssertions(8);
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
        expect(e instanceof MintingError).to.be.true;

        const error = e as MintingError;
        expect(error.message).to.eq("Merkle proof verification failed");
        expect(error.payload).to.deep.eq({
          root: mockRoot,
          proof: merkleTree.getProof([allowlist[0].address, allowlist[0].units.toString()]),
        });
      }

      expect(hash).to.be.undefined;
      expect(metaDataStub.callCount).to.eq(0);
      expect(dataStub.callCount).to.eq(0);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(0);
    });
  });

  describe("Batch mint fractions", () => {
    it("should allow to batch mint a claim from an allowlist without the root", async () => {
      chai.Assertion.expectAssertions(5);
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

      expect(isHex(hash)).to.be.true;
      expect(metaDataStub.callCount).to.eq(0);
      expect(dataStub.callCount).to.eq(0);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("should allow to mint a claim from an allowlist with a correct root", async () => {
      chai.Assertion.expectAssertions(5);
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

      expect(isHex(hash)).to.be.true;
      expect(metaDataStub.callCount).to.eq(0);
      expect(dataStub.callCount).to.eq(0);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(1);
    });

    it("should not allow to mint a claim from an allowlist with an incorrect root", async () => {
      chai.Assertion.expectAssertions(8);
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
        expect(e instanceof MintingError).to.be.true;

        const error = e as MintingError;
        expect(error.message).to.eq("Merkle proof verification failed");
        expect(error.payload).to.deep.eq({
          root: mockRoot,
          proof: secondProofs,
        });
      }

      expect(hash).to.be.undefined;
      expect(metaDataStub.callCount).to.eq(0);
      expect(dataStub.callCount).to.eq(0);
      expect(readSpy.callCount).to.eq(0);
      expect(writeSpy.callCount).to.eq(0);
    });
  });
});
