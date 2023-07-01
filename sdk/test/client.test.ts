import { expect } from "chai";
import { MockProvider } from "ethereum-waffle";
import { ethers } from "ethers";
import sinon from "sinon";

import { HypercertClient, HypercertMetadata, TransferRestrictions } from "../src/index.js";
import { AllowlistEntry, ClientError, UnsupportedChainError } from "../src/types/index.js";

const provider = new MockProvider();
sinon.stub(provider, "on");

describe("HypercertClient setup tests", () => {
  afterAll(() => {
    sinon.restore();
  });

  it("should be able to create a new read only instance when missing storage keys", () => {
    sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: null });
    sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN: null });
    sinon.stub(process, "env").value({ NEXT_PUBLIC_NFT_STORAGE_TOKEN: null });
    sinon.stub(process, "env").value({ NEXT_PUBLIC_WEB3_STORAGE_TOKEN: null });

    const client = new HypercertClient({ operator: provider });

    expect(client).to.be.an.instanceOf(HypercertClient);
    expect(client.readonly).to.be.true;
  });

  it("should be able to create a new instance", () => {
    const operator = ethers.Wallet.createRandom();

    const config = { chainId: 5, operator, nftStorageToken: "test", web3StorageToken: "test" };
    const client = new HypercertClient(config);
    expect(client).to.be.an.instanceOf(HypercertClient);
    expect(client.readonly).to.be.false;
  });

  it("should throw an error when the chainId is not supported", () => {
    try {
      new HypercertClient({ operator: provider, chainId: 1337 });
      expect.fail("Should throw UnsupportedChainError");
    } catch (e) {
      expect(e).to.be.instanceOf(UnsupportedChainError);

      const error = e as UnsupportedChainError;
      expect(error.message).to.eq("chainId=1337 is not yet supported");
      expect(Number(error.payload?.chainID)).to.eq(1337);
    }
  });

  it("should throw an error when executing write method in readonly mode", async () => {
    sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: null });
    sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN: null });
    sinon.stub(process, "env").value({ NEXT_PUBLIC_NFT_STORAGE_TOKEN: null });
    sinon.stub(process, "env").value({ NEXT_PUBLIC_WEB3_STORAGE_TOKEN: null });

    const client = new HypercertClient({ operator: provider });

    // mintClaim
    try {
      const metaData = { name: "test" } as HypercertMetadata;
      const totalUnits = 1;
      const transferRestrictions = TransferRestrictions.AllowAll;

      await client.mintClaim(metaData, totalUnits, transferRestrictions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client instanceof HypercertClient).to.be.true;
    }

    // createAllowlist
    try {
      const allowlist: AllowlistEntry[] = [{ address: "0x0000000", units: 100 }];
      const metaData = { name: "test" } as HypercertMetadata;
      const totalUnits = 1;
      const transferRestrictions = TransferRestrictions.AllowAll;

      await client.createAllowlist(allowlist, metaData, totalUnits, transferRestrictions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // splitClaimUnits
    try {
      const claimId = 1;
      const fractions = [100, 200];

      await client.splitClaimUnits(claimId, fractions);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // mergeClaimUnits
    try {
      const claimIds = [1, 2];

      await client.mergeClaimUnits(claimIds);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // burnClaimFraction
    try {
      const claimId = 1;

      await client.burnClaimFraction(claimId);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
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
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }

    // batchMintClaimFractionsFromAllowlist
    try {
      const claimIds = [1, 2];
      const units = [100, 200];
      const proofs = [
        ["0x1", "0x2", "0x3"],
        ["0x4", "0x5", "0x6"],
      ];
      const roots = ["0x7", "0x8"];

      await client.batchMintClaimFractionsFromAllowlists(claimIds, units, proofs, roots);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e).to.be.instanceOf(ClientError);

      const error = e as ClientError;
      expect(error.message).to.eq("Client is readonly");
      expect(error.payload?.client).to.be.instanceOf(HypercertClient);
    }
  });
});
