import axios from "axios";
import { expect } from "chai";

import { HypercertsStorage } from "../src/index.js";

const mockMetadata = JSON.parse(`
{
  "name": "mock",
  "description": "mock description",
  "image": "image.jpg",
  "properties": {
    "impactScopes": "mock impact scope",
    "workScopes": "mock work scope",
    "impactTimeframe": [12345678, 87654321],
    "workTimeframe": [87654321, 123456678],
    "contributors": ["0x0", "vitalik"]
  }
}`);
const mockData = JSON.parse(`{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}`);

const mockMetadataCid = "bafkreigdm2flneb4khd7eixodagst5nrndptgezrjux7gohxcngjn67x6u";

const mockDataCid = "bafkreif5otrkydrrjbp532a75hkm5goefxv5rqg35d2wqm6oveht4hqto4";

/**
 * Skipping these tests currently,
 * don't want to test against production web3.storage and nft.storage servers
 */
describe.skip("IPFS Client", () => {
  let storage: HypercertsStorage;

  beforeEach(() => {
    storage = new HypercertsStorage({});
  });
  /**
   * Currently just testing against the production NFT.Storage service.
   */
  it("Smoke test - add metadata", async () => {
    const result = await storage.storeMetadata(mockMetadata);
    expect(result).to.be.a("string");
    expect(result).to.equal(mockMetadataCid);
  });

  it("Smoke test - get metadata", async () => {
    const data = await storage.getMetadata(mockMetadataCid);

    expect(data).to.deep.equal(mockMetadata);
  });

  it("Smoke test - add data", async () => {
    const result = await storage.storeData(mockData);
    expect(result).to.be.a("string");
    expect(result).to.equal(mockDataCid);
  });

  it("Smoke test - get data", async () => {
    // Using the getter
    const data = await storage.getData(mockDataCid);
    expect(data).to.deep.equal(mockData);
    // Using an IPFS gateway
    const nftStorageGatewayLink = storage.getNftStorageGatewayUri(mockDataCid);
    const gatewayData = await axios.get(nftStorageGatewayLink).then((result) => result.data);
    expect(gatewayData).to.deep.equal(mockData);
  });
});

describe("Storage utilities", () => {
  it("Removes ipfs:// prefix if present to get CID", () => {
    const storage = new HypercertsStorage({});
    const uriFromCid = storage.getNftStorageGatewayUri(mockDataCid);
    const uriFromIpfsLink = storage.getNftStorageGatewayUri(`ipfs://${mockDataCid}`);
    expect(uriFromCid).to.eq(uriFromIpfsLink);
  });
});
