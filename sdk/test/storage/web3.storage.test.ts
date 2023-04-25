//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { jest } from "@jest/globals";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { Web3Storage } from "web3.storage";

import HypercertsStorage from "../../src/storage.js";
import { logger } from "../../src/utils/logger.js";
import { getFormattedMetadata } from "../helpers.js";
import mockData from "../res/mockData.js";
import mockMetadata from "../res/mockMetadata.js";

const mockCorrectMetadataCid = "testCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";
const mockIncorrectMetadataCid = "errrCID1234fkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

const storeBlobMock = jest.spyOn(Web3Storage.prototype, "put").mockImplementation((_: unknown, __?: unknown) => {
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

describe("Web3.Storage Client", () => {
  const storage = new HypercertsStorage({});

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => {
    server.close();
    jest.restoreAllMocks();
  });

  /**
   * Currently just testing against the production NFT.Storage service.
   */
  it("Smoke test - add data", async () => {
    await storage.storeData(mockData);
    expect(storeBlobMock).toHaveBeenCalledTimes(1);
  });

  it("Smoke test - get data", async () => {
    const res = await storage.getData(mockCorrectMetadataCid);

    expect(res).toMatchObject(mockMetadata);
  });
});
