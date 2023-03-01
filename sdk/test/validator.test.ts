import { expect } from "chai";
import { validateClaimData, validateMetaData } from "../src/index.js";
import type { HypercertMetadata, HypercertClaimdata } from "../src/index.js";

import testData from "./res/mockMetadata.js";

describe("Validate claim test", () => {
  it("checking default metadata", () => {
    expect(validateMetaData(testData).valid).to.be.true;
    expect(Object.keys(validateMetaData(testData).errors).length).to.eq(0);
    expect(validateMetaData({} as HypercertMetadata).valid).to.be.false;
    expect(Object.keys(validateMetaData({} as HypercertMetadata).errors).length).to.gt(0);
  });

  it("checking default claimdata", () => {
    expect(validateClaimData(testData.hypercert).valid).to.be.true;
    expect(Object.keys(validateClaimData(testData.hypercert).errors).length).to.eq(0);
    expect(validateClaimData({} as HypercertClaimdata).valid).to.be.false;
    expect(Object.keys(validateClaimData({} as HypercertClaimdata).errors).length).to.gt(0);
  });
});
