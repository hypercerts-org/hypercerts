import { expect } from "chai";
import { ethers } from "ethers";

import { HypercertClient, HypercertMetadata, TransferRestrictions, Allowlist } from "../src/index.js";
import HypercertsStorage from "../src/storage.js";
import { ClientError, UnsupportedChainError } from "../src/types/errors.js";
import { reloadEnv } from "./setup-tests.js";

describe("HypercertClient", () => {
  beforeEach(() => {
    reloadEnv();
  });

  it("should be able to create a new read only instance when missing storage keys", () => {
    delete process.env.NFT_STORAGE_TOKEN;
    delete process.env.WEB3_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

    const client = new HypercertClient({});

    expect(client).to.be.an.instanceOf(HypercertClient);
    expect(client.readonly).to.be.true;
  });

  it("should be able to create a new instance", () => {
    const signer = ethers.Wallet.createRandom();
    const storage = new HypercertsStorage({ nftStorageToken: "test", web3StorageToken: "test" });

    const config = { chainId: 5, signer };
    const client = new HypercertClient({ config, storage });
    expect(client).to.be.an.instanceOf(HypercertClient);
    expect(client.readonly).to.be.false;
  });

  it("should throw an error when the chainId is not supported", () => {
    try {
      new HypercertClient({ config: { chainId: 1337 } });
      expect.fail("Should throw UnsupportedChainError");
    } catch (e) {
      expect(e instanceof UnsupportedChainError).to.be.true;

      const error = e as UnsupportedChainError;
      expect(error.message).to.eq("chainId=1337 is not yet supported");
      expect(error.payload.chainID).to.eq(1337);
    }
  });

  it("should throw an error when executing write method in readonly mode", async () => {
    delete process.env.NFT_STORAGE_TOKEN;
    delete process.env.WEB3_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

    const client = new HypercertClient({});

    // mintClaim
    try {
      const metaData = { name: "test" } as HypercertMetadata;
      const totalUnits = 1;
      const transferRestrictions = TransferRestrictions.AllowAll;

      await client.mintClaim(metaData, totalUnits, transferRestrictions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e instanceof ClientError).to.be.true;

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client instanceof HypercertClient).to.be.true;
    }

    // createAllowlist
    try {
      const allowlist: Allowlist = [{ address: "0x0000000", units: 100 }];
      const metaData = { name: "test" } as HypercertMetadata;
      const totalUnits = 1;
      const transferRestrictions = TransferRestrictions.AllowAll;

      await client.createAllowlist(allowlist, metaData, totalUnits, transferRestrictions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e instanceof ClientError).to.be.true;

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client instanceof HypercertClient).to.be.true;
    }

    // splitClaimUnits
    try {
      const claimId = 1;
      const fractions = [100, 200];

      await client.splitClaimUnits(claimId, fractions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e instanceof ClientError).to.be.true;

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client instanceof HypercertClient).to.be.true;
    }

    // mergeClaimUnits
    try {
      const claimIds = [1, 2];

      await client.mergeClaimUnits(claimIds);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e instanceof ClientError).to.be.true;

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client instanceof HypercertClient).to.be.true;
    }

    // burnClaimFraction
    try {
      const claimId = 1;

      await client.burnClaimFraction(claimId);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e instanceof ClientError).to.be.true;

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client instanceof HypercertClient).to.be.true;
    }

    // mintClaimFractionFromAllowlist
    try {
      const claimId = 1;
      const units = 100;
      const proof = ["0x1", "0x2", "0x3"];
      const root = "0x4";

      await client.mintClaimFractionFromAllowlist(claimId, units, proof, root);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e instanceof ClientError).to.be.true;

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client instanceof HypercertClient).to.be.true;
    }
  });
});
