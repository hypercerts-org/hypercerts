import { expect } from "chai";

import HypercertsStorage from "../src/storage.js";
import { StorageError } from "../src/types/errors.js";
import { HypercertMetadata } from "src/index.js";
import { reloadEnv } from "./setup-tests.js";
describe("HypercertsStorage", () => {
  beforeAll(() => {
    delete process.env.NFT_STORAGE_TOKEN;
    delete process.env.WEB3_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    delete process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;
  });

  afterAll(() => reloadEnv());

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
});
