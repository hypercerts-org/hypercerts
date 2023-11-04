import { jest } from "@jest/globals";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Web3Storage } from "web3.storage";

import HypercertsStorage from "../../src/storage.js";
import { mockDataSets } from "../helpers.js";

describe("Web3.Storage Client", () => {
  const { hypercertData, hypercertMetadata } = mockDataSets;

  const storeBlobMock = jest.spyOn(Web3Storage.prototype, "put").mockImplementation((_: unknown, __?: unknown) => {
    return Promise.resolve(hypercertMetadata.cid);
  });

  const storage = new HypercertsStorage({
    nftStorageToken: process.env.NFT_STORAGE_TOKEN,
    web3StorageToken: process.env.WEB3_STORAGE_TOKEN,
  });

  jest.spyOn(storage, "getFromIPFS").mockImplementation((cid: string) => {
    if (cid === hypercertMetadata.cid) return Promise.resolve(hypercertMetadata.data);
    if (cid === hypercertData.cid) return Promise.resolve(hypercertData.data);

    return Promise.resolve("testData");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  /**
   * Currently just testing against the production NFT.Storage service.
   */
  it("Smoke test - add data", async () => {
    await storage.storeData(hypercertData.data);
    expect(storeBlobMock).toHaveBeenCalledTimes(1);
  });

  it("Smoke test - get data", async () => {
    const res = await storage.getData(hypercertData.cid);

    expect(res).toMatchObject(hypercertData.data);
  });
});
