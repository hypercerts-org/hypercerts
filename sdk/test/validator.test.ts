import { expect } from "chai";

import { validateClaimData, validateMetaData } from "../src/index.js";
import type { HypercertClaimdata, HypercertMetadata } from "../src/index.js";
import testData from "./res/mockMetadata.js";

describe("Validate claim test", () => {
  it("checking default metadata", () => {
    expect(validateMetaData(testData).valid).to.be.true;

    const invalidResult = validateMetaData({} as HypercertMetadata);

    expect(invalidResult.valid).to.be.false;
    expect(Object.keys(invalidResult.errors).length).to.be.gt(0);
  });

  it("checking default claimdata", () => {
    expect(validateClaimData(testData.hypercert).valid).to.be.true;

    const invalidResult = validateClaimData({} as HypercertClaimdata);

    expect(invalidResult.valid).to.be.false;
    expect(Object.keys(invalidResult.errors).length).to.be.gt(0);
  });
});
