import { expect } from "chai";
import { HypercertMetadata } from "../src";

import HypercertsStorage from "../src/storage";
import { StorageError } from "../src/types/errors";
import { reloadEnv } from "./setup-env";

describe("HypercertsStorage", () => {
  beforeAll(() => {
    delete process.env.NFT_STORAGE_TOKEN;
    delete process.env.WEB3_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
  });

  afterAll(() => {
    reloadEnv();
  });

  it("should be able to create a new instance without valid storage keys", () => {
    const storage = new HypercertsStorage({});

    expect(storage).to.be.an.instanceOf(HypercertsStorage);
    expect(storage.readonly).to.be.true;
  });

  it("should be able to create a new instance with valid storage keys", () => {
    const storage = new HypercertsStorage({ nftStorageToken: "test", web3StorageToken: "test" });

    expect(storage).to.be.an.instanceOf(HypercertsStorage);
    expect(storage.readonly).to.be.false;
  });

  it("should block calls to store data when in read only mode", async () => {
    const storage = new HypercertsStorage({});

    expect(async () => storage.storeData({}).should.throw(StorageError, "Web3.storage client is not configured"));
    expect(async () =>
      storage.storeMetadata({} as HypercertMetadata).should.throw(StorageError, "NFT.storage client is not configured"),
    );
  });

  it("should throw an error when executing write method in readonly mode", async () => {
    delete process.env.NFT_STORAGE_TOKEN;
    delete process.env.WEB3_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

    const client = new HypercertsStorage({});

    // storeMetadata
    try {
      const metaData = { name: "test" } as HypercertMetadata;

      await client.storeMetadata(metaData);
      expect.fail("Should throw StorageError");
    } catch (e) {
      expect(e instanceof StorageError).to.be.true;

      const error = e as StorageError;
      expect(error.message).to.eq("NFT.storage client is not configured");
    }

    // storeData
    try {
      const data = { name: "test" };

      await client.storeData(data);
      expect.fail("Should throw ClientError");
    } catch (e) {
      expect(e instanceof StorageError).to.be.true;

      const error = e as StorageError;
      expect(error.message).to.eq("Web3.storage client is not configured");
    }
  });
});
