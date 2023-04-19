import { expect } from "chai";

import { validateClaimData, validateMetaData } from "../src/index.js";
import type { HypercertClaimdata, HypercertMetadata } from "../src/index.js";
import { logger } from "../src/utils/logger.js";
import testData from "./res/mockMetadata.js";

describe("Validate claim test", () => {
  it("checking default metadata", () => {
    const validated = validateMetaData(testData);
    expect(validated.isOk).to.be.true;
    expect(validated.isErr).to.be.false;

    const invalid = validateMetaData({} as HypercertMetadata);
    expect(invalid.isOk).to.be.false;
    expect(invalid.isErr).to.be.true;

    logger.debug(invalid);

    if (invalid.isErr) {
      logger.debug("IS ERR");
      logger.debug(invalid.error.payload);

      expect(Object.keys(validateMetaData({} as HypercertMetadata).unwrapOr([])).length).to.eq(0);
      expect(invalid.error.message).to.eq("Metadata validation failed");
      expect(invalid?.error?.payload).to.not.be.undefined;
    }
  });

  it("checking default claimdata", () => {
    const validated = validateClaimData(testData.hypercert);

    expect(validated.isOk).to.be.true;
    expect(validated.isErr).to.be.false;

    const invalid = validateClaimData({} as HypercertClaimdata);
    expect(invalid.isOk).to.be.false;
    expect(invalid.isErr).to.be.true;

    if (invalid.isErr) {
      expect(Object.keys(validateClaimData({} as HypercertClaimdata).unwrapOr([])).length).to.eq(0);
      expect(invalid.error.message).to.eq("Claimdata validation failed");
      expect(invalid?.error?.payload).to.not.be.undefined;
    }
  });
});
