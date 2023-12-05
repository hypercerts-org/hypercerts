import { describe, it, afterEach, afterAll, vi } from "vitest";
import chai, { expect } from "chai";
import assertionsCount from "chai-assertions-count";

//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NFTStorage } from "nft.storage";

import { HypercertsStorage } from "../../src/storage";
import { MalformedDataError } from "../../src/types/errors";
import { HypercertMetadata } from "../../src/types/metadata";
import { getFormattedMetadata, mockDataSets } from "../helpers";
import sinon from "sinon";
import axios from "axios";

chai.use(assertionsCount);

describe("NFT.Storage Client", () => {
  const { hypercertMetadata } = mockDataSets;

  const storeBlobMock = sinon.stub(NFTStorage.prototype, "storeBlob").resolves(hypercertMetadata.cid);

  const storage = new HypercertsStorage({
    nftStorageToken: process.env.NFT_STORAGE_TOKEN,
    web3StorageToken: process.env.WEB3_STORAGE_TOKEN,
  });

  afterEach(() => {
    chai.Assertion.resetAssertsCheck();
    vi.clearAllMocks();
    sinon.restore();
  });

  afterAll(() => {
    vi.resetAllMocks();
    sinon.resetBehavior();
  });

  /**
   * Currently just testing against the production NFT.Storage service.
   */
  it("Smoke test - add metadata", async () => {
    await storage.storeMetadata(getFormattedMetadata());
    expect(storeBlobMock.callCount).to.eq(1);
  });

  it("Smoke test - get metadata", async () => {
    sinon.stub(axios, "get").resolves(Promise.resolve({ data: hypercertMetadata.data }));
    const res = await storage.getMetadata(hypercertMetadata.cid);

    expect(res).to.deep.eq(hypercertMetadata.data);
  });

  it("Throws when trying to store incorrect metadata", async () => {
    chai.Assertion.expectAssertions(2);
    // storeData
    try {
      await storage.storeMetadata({ data: "false" } as unknown as HypercertMetadata);
    } catch (e) {
      expect(e).to.be.an.instanceOf(MalformedDataError);

      const error = e as MalformedDataError;
      expect(error.message).to.eq("Invalid metadata.");
    }
  });

  it("Throws when trying to fetch incorrect metadata", async () => {
    chai.Assertion.expectAssertions(2);
    const incorrectCID = "incorrect-cid";
    sinon.stub(axios, "get").resolves(Promise.resolve({ data: "false" }));

    // storeData
    try {
      await storage.getMetadata(incorrectCID);
    } catch (e) {
      expect(e).to.be.an.instanceOf(MalformedDataError);

      const error = e as MalformedDataError;
      expect(error.message).to.be.eq(`Invalid metadata at ${incorrectCID}`);
    }
  });
});
