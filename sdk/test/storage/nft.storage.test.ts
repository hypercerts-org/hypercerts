import { jest } from "@jest/globals";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { NFTStorage } from "nft.storage";

import HypercertsStorage from "../../src/storage.js";
import { MalformedDataError } from "../../src/types/errors.js";
import { HypercertMetadata } from "../../src/types/metadata.js";
import logger from "../../src/utils/logger.js";
import { getFormattedMetadata } from "../helpers.js";
import mockData from "../res/mockData.js";
import mockMetadata from "../res/mockMetadata.js";

describe("NFT.Storage Client", () => {
  const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";
  const mockIncorrectMetadataCid = "errrCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

  const storeBlobMock = jest.spyOn(NFTStorage.prototype, "storeBlob").mockImplementation((_: unknown, __?: unknown) => {
    logger.debug("Hit mock storeBlob");

    return Promise.resolve(mockCorrectMetadataCid);
  });

  const server = setupServer(
    rest.get(`https://nftstorage.link/ipfs/${mockCorrectMetadataCid}`, (_, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockMetadata));
    }),
    rest.get(`https://nftstorage.link/ipfs/${mockIncorrectMetadataCid}`, (_, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockData));
    }),
  );

  const storage = new HypercertsStorage({});

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    server.close();
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
    const res = await storage.getMetadata(mockCorrectMetadataCid);

    expect(res).toMatchObject(mockMetadata);
  });

  it("Throws when trying to store incorrect metadata", async () => {
    // storeData
    try {
      await storage.storeMetadata(mockData as HypercertMetadata);
    } catch (e) {
      expect(e instanceof MalformedDataError).toBeTruthy();

      const error = e as MalformedDataError;
      expect(error.message).toBe("Invalid metadata.");
    }

    expect.assertions(2);
  });

  it("Throws when trying to fetch incorrect metadata", async () => {
    // storeData
    try {
      await storage.getMetadata(mockIncorrectMetadataCid);
    } catch (e) {
      expect(e instanceof MalformedDataError).toBeTruthy();

      const error = e as MalformedDataError;
      expect(error.message).toBe(`Invalid metadata at ${mockIncorrectMetadataCid}`);
    }

    expect.assertions(2);
  });
});
