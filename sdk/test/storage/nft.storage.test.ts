import { jest } from "@jest/globals";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NFTStorage } from "nft.storage";

import HypercertsStorage from "../../src/storage.js";
import { MalformedDataError } from "../../src/types/errors.js";
import { HypercertMetadata } from "../../src/types/metadata.js";
import { getFormattedMetadata, mockDataSets } from "../helpers.js";

describe("NFT.Storage Client", () => {
  const { hypercertData, hypercertMetadata } = mockDataSets;

  const storeBlobMock = jest.spyOn(NFTStorage.prototype, "storeBlob").mockImplementation((_: unknown, __?: unknown) => {
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
  it("Smoke test - add metadata", async () => {
    await storage.storeMetadata(getFormattedMetadata());
    expect(storeBlobMock).toHaveBeenCalledTimes(1);
  });

  it("Smoke test - get metadata", async () => {
    const res = await storage.getMetadata(hypercertMetadata.cid);

    expect(res).toMatchObject(hypercertMetadata.data);
  });

  it("Throws when trying to store incorrect metadata", async () => {
    // storeData
    try {
      await storage.storeMetadata({ data: "false" } as unknown as HypercertMetadata);
    } catch (e) {
      expect(e instanceof MalformedDataError).toBeTruthy();

      const error = e as MalformedDataError;
      expect(error.message).toBe("Invalid metadata.");
    }

    expect.assertions(2);
  });

  it("Throws when trying to fetch incorrect metadata", async () => {
    const incorrectCID = "incorrect-cid";
    // storeData
    try {
      await storage.getMetadata(incorrectCID);
    } catch (e) {
      expect(e instanceof MalformedDataError).toBeTruthy();

      const error = e as MalformedDataError;
      expect(error.message).toBe(`Invalid metadata at ${incorrectCID}`);
    }

    expect.assertions(2);
  });
});
