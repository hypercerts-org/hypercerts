import { describe, it, afterAll } from "vitest";

import { expect } from "chai";
import sinon from "sinon";

import { HypercertClient, HypercertMetadata, TransferRestrictions } from "../src";
import { AllowlistEntry, ClientError, UnsupportedChainError } from "../src/types";
import { publicClient, walletClient } from "./helpers";

describe("HypercertClient setup tests", () => {
  afterAll(() => {
    sinon.restore();
  });

  it("should be able to create a new read only instance when missing storage keys", () => {
    const readOnlyClient = new HypercertClient({
      chain: { id: 5 },
      publicClient,
    });

    expect(readOnlyClient).to.be.an.instanceOf(HypercertClient);
    expect(readOnlyClient.readonly).to.be.true;
  });

  it("should be able to create a new instance", () => {
    const client = new HypercertClient({
      chain: { id: 5 },
      publicClient,
      walletClient,
      nftStorageToken: "test",
      web3StorageToken: "test",
    });
    expect(client).to.be.an.instanceOf(HypercertClient);

    //TODO currently only publicClient added as a test, also add other flows
    expect(client.readonly).to.be.false;
  });

  it("should throw an error when the chainId is not supported", () => {
    const falseChainId = 1337;
    try {
      new HypercertClient({ chain: { id: falseChainId } });
      expect.fail("Should throw UnsupportedChainError");
    } catch (e) {
      expect(e).to.be.instanceOf(UnsupportedChainError);

      const error = e as UnsupportedChainError;
      expect(error.message).to.eq("No default config for chainId=1337 found in SDK");
      expect(Number(error.payload?.chainID)).to.eq(falseChainId);
    }
  });

  it("should throw an error when executing write method in readonly mode", async () => {
    const client = new HypercertClient({ chain: { id: 5 } });

    // mintClaim
    try {
      const metaData = { name: "test" } as HypercertMetadata;
      const totalUnits = 1n;
      const transferRestrictions = TransferRestrictions.AllowAll;

      await client.mintClaim(metaData, totalUnits, transferRestrictions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Could not connect to wallet; sending transactions not allowed.");
      expect(error.payload?.client instanceof HypercertClient).to.be.true;
    }

    // createAllowlist
    try {
      const allowlist: AllowlistEntry[] = [{ address: "0x0000000", units: 100n }];
      const metaData = { name: "test" } as HypercertMetadata;
      const totalUnits = 1n;
      const transferRestrictions = TransferRestrictions.AllowAll;

      await client.createAllowlist(allowlist, metaData, totalUnits, transferRestrictions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Could not connect to wallet; sending transactions not allowed.");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // splitClaimUnits
    try {
      const claimId = 1n;
      const fractions = [100n, 200n];

      await client.splitFractionUnits(claimId, fractions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Could not connect to wallet; sending transactions not allowed.");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // mergeClaimUnits
    try {
      const claimIds = [1n, 2n];

      await client.mergeFractionUnits(claimIds);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Could not connect to wallet; sending transactions not allowed.");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // burnClaimFraction
    try {
      const claimId = 1n;

      await client.burnClaimFraction(claimId);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Could not connect to wallet; sending transactions not allowed.");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // mintClaimFractionFromAllowlist
    try {
      const claimId = 1n;
      const units = 100n;
      const proof = ["0x1", "0x2", "0x3"] as `0x${string}`[];
      const root = "0x4" as `0x${string}`;

      await client.mintClaimFractionFromAllowlist(claimId, units, proof, root);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Could not connect to wallet; sending transactions not allowed.");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // batchMintClaimFractionsFromAllowlist
    try {
      const claimIds = [1n, 2n];
      const units = [100n, 200n];
      const proofs = [["0x1", "0x2", "0x3"] as `0x${string}`[], ["0x4", "0x5", "0x6"] as `0x${string}`[]];
      const roots = ["0x7", "0x8"] as `0x${string}`[];

      await client.batchMintClaimFractionsFromAllowlists(claimIds, units, proofs, roots);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Could not connect to wallet; sending transactions not allowed.");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }
  });
});
