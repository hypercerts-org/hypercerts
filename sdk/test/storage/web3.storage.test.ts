import { describe, it, afterEach, afterAll } from "vitest";
import { expect } from "chai";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Web3Storage } from "web3.storage";

import { HypercertsStorage } from "../../src/storage";
import { mockDataSets } from "../helpers";
import axios from "axios";
import sinon from "sinon";

describe("Web3.Storage Client", () => {
  const { hypercertData, hypercertMetadata } = mockDataSets;

  const storeBlobMock = sinon.stub(Web3Storage.prototype, "put").resolves(hypercertMetadata.cid);

  const storage = new HypercertsStorage({
    nftStorageToken: process.env.NFT_STORAGE_TOKEN,
    web3StorageToken: process.env.WEB3_STORAGE_TOKEN,
  });

  afterEach(() => {
    sinon.restore();
  });

  afterAll(() => {
    sinon.resetBehavior();
  });

  /**
   * Currently just testing against the production NFT.Storage service.
   */
  it("Smoke test - add data", async () => {
    await storage.storeData(hypercertData.data);
    expect(storeBlobMock.callCount).to.eq(1);
  });

  it("Smoke test - get data", async () => {
    sinon.stub(axios, "get").resolves(Promise.resolve({ data: hypercertData.data }));
    const res = await storage.getData(hypercertData.cid);

    expect(res).to.deep.eq(hypercertData.data);
  });
});
