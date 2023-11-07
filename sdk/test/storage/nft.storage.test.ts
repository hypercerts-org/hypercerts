import { jest } from "@jest/globals";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { NFTStorage } from "nft.storage";

import HypercertsStorage from "../../src/storage";
import { MalformedDataError } from "../../src/types/errors";
import { HypercertMetadata } from "../../src/types/metadata";
import { getFormattedMetadata, mockDataSets } from "../helpers";
import fetchers from "../../src/utils/fetchers";
import sinon from "sinon";

describe("NFT.Storage Client", () => {
  const { hypercertMetadata } = mockDataSets;

  const storeBlobMock = jest.spyOn(NFTStorage.prototype, "storeBlob").mockImplementation((_: unknown, __?: unknown) => {
    return Promise.resolve(hypercertMetadata.cid);
  });

  const ipfsFetcherMock = sinon.stub(fetchers, "getFromIPFS");

  const storage = new HypercertsStorage({
    nftStorageToken: process.env.NFT_STORAGE_TOKEN,
    web3StorageToken: process.env.WEB3_STORAGE_TOKEN,
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
    sinon.resetBehavior();
  });

  /**
   * Currently just testing against the production NFT.Storage service.
   */
  it("Smoke test - add metadata", async () => {
    await storage.storeMetadata(getFormattedMetadata());
    expect(storeBlobMock).toHaveBeenCalledTimes(1);
  });

  it("Smoke test - get metadata", async () => {
    ipfsFetcherMock.returns(Promise.resolve(hypercertMetadata.data));
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

    ipfsFetcherMock.resolves({ data: "false" });
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
