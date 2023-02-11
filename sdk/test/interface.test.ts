import * as SDK from "../src/index.js";

describe("Interface spec", () => {
  it("Exposes validation methods", async () => {
    expect(SDK).toMatchObject({
      validateMetaData: expect.any(Function),
      validateClaimData: expect.any(Function),
      storeMetadata: expect.any(Function),
      storeData: expect.any(Function),
      getMetadata: expect.any(Function),
      getData: expect.any(Function),
      deleteMetadata: expect.any(Function),
    });
  });

  it("Exposes Graph queries", async () => {
    expect(SDK).toMatchObject({
      claimsByOwner: expect.any(Function),
      claimById: expect.any(Function),
      firstClaims: expect.any(Function),
      fractionsByOwner: expect.any(Function),
      fractionsByClaim: expect.any(Function),
    });
  });

  // TODO ensure exported types
});
