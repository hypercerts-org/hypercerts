import { jest } from "@jest/globals";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Web3Storage } from "web3.storage";

import HypercertsStorage from "../../src/storage";
import { mockDataSets } from "../helpers";
import fetchers from "../../src/utils/fetchers";
import sinon from "sinon";

describe("Web3.Storage Client", () => {
  const { hypercertData, hypercertMetadata } = mockDataSets;

  const storeBlobMock = jest.spyOn(Web3Storage.prototype, "put").mockImplementation((_: unknown, __?: unknown) => {
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
  it("Smoke test - add data", async () => {
    await storage.storeData(hypercertData.data);
    expect(storeBlobMock).toHaveBeenCalledTimes(1);
  });

  it("Smoke test - get data", async () => {
    ipfsFetcherMock.returns(Promise.resolve(hypercertData.data));
    const res = await storage.getData(hypercertData.cid);

    expect(res).toMatchObject(hypercertData.data);
  });
});
