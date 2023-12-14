import { describe, it } from "vitest";

import { expect } from "chai";

import { validateClaimData, validateMetaData } from "../src";
import type { HypercertClaimdata, HypercertMetadata } from "../src";
import { validateDuplicateEvaluationData, validateSimpleTextEvaluationData } from "../src/validator";
import { getDuplicateEvaluationData, getSimpleTextEvaluationData, mockDataSets } from "./helpers";
import { DuplicateEvaluation, SimpleTextEvaluation } from "../src/types/evaluation";

describe("Validate claim test", () => {
  const { hypercertData, hypercertMetadata } = mockDataSets;
  it("checking default metadata", () => {
    const result = validateMetaData(hypercertMetadata.data);
    expect(result.valid).to.be.true;

    const invalidResult = validateMetaData({} as HypercertMetadata);

    expect(invalidResult.valid).to.be.false;
    expect(Object.keys(invalidResult.errors).length).to.be.gt(0);
  });

  it("checking default claimdata", () => {
    const result = validateClaimData(hypercertData.data);
    expect(result.valid).to.be.true;

    const invalidResult = validateClaimData({} as HypercertClaimdata);

    expect(invalidResult.valid).to.be.false;
    expect(Object.keys(invalidResult.errors).length).to.be.gt(0);
  });

  it("checking duplicate hypercerts evaluation data", () => {
    const duplicateEvaluationData = getDuplicateEvaluationData();
    expect(validateDuplicateEvaluationData(duplicateEvaluationData).valid).to.be.true;

    const invalidResult = validateDuplicateEvaluationData({} as DuplicateEvaluation);

    expect(invalidResult.valid).to.be.false;
    expect(Object.keys(invalidResult.errors).length).to.be.gt(0);
  });

  it("checking simple text hypercerts evaluation data", () => {
    const simpleTextEvaluationData = getSimpleTextEvaluationData();

    expect(validateSimpleTextEvaluationData(simpleTextEvaluationData).valid).to.be.true;

    const invalidResult = validateSimpleTextEvaluationData({} as SimpleTextEvaluation);

    expect(invalidResult.valid).to.be.false;
    expect(Object.keys(invalidResult.errors).length).to.be.gt(0);
  });
});
