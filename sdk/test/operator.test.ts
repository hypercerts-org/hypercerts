import { expect, assert } from "chai";
import { getData, getMetadata, storeData, storeMetadata } from "../src/index.js";
import metadata from "./res/mockMetadata.js";
import data from "./res/mockData.js";

import { HypercertMetadata } from "../src/types/metadata.js";
import { getIpfsGatewayUri } from "../src/operator/index.js";

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

describe("IPFS Client", () => {
  /**
   * Currently just testing against the production NFT.Storage service.
   */
  it("Smoke test - add metadata", async () => {
    const result = await storeMetadata(mockMetadata);
    expect(result).to.be.a("string");
    expect(result).to.equal(mockMetadataCid);
  });

  it("Smoke test - get metadata", async () => {
    const data = await getMetadata(mockMetadataCid);

    expect(data).to.deep.equal(mockMetadata);
  });

  it("Smoke test - add data", async () => {
    const result = await storeData(mockData);
    expect(result).to.be.a("string");
    expect(result).to.equal(mockDataCid);
  });

  it("Smoke test - get data", async () => {
    const data = await getData(mockDataCid);

    expect(data).to.deep.equal(mockData);
  });

  it("Removes ipfs:// prefix if present to get CID", () => {
    const uriFromCid = getIpfsGatewayUri(mockDataCid);
    const uriFromIpfsLink = getIpfsGatewayUri(`ipfs://${mockDataCid}`);
    expect(uriFromCid).to.eq(uriFromIpfsLink);
  });
});
