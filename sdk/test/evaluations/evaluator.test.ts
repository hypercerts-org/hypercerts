import { describe, it, afterAll, beforeEach } from "vitest";
import chai, { expect } from "chai";
import assertionsCount from "chai-assertions-count";
import sinon from "sinon";

import { HypercertEvaluator } from "../../src/evaluations";
import { MalformedDataError, StorageError } from "../../src/types/errors";
import { HypercertEvaluationSchema } from "../../src/types/evaluation";
import { getEvaluationData, publicClient, walletClient } from "../helpers";

chai.use(assertionsCount);

describe("HypercertEvaluator", () => {
  const signer = walletClient.account;
  const evaluator = new HypercertEvaluator({
    chain: { id: 5 },
    easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    publicClient,
  });

  beforeEach(() => {
    sinon.resetHistory();
  });

  afterAll(() => {
    sinon.restore();
  });

  describe("submitEvaluation", () => {
    it("should throw an error for unexpected evaluation source", async () => {
      chai.Assertion.expectAssertions(2);

      const evaluation = {
        creator: signer?.address,
        evaluationSource: {
          type: "invalid",
        },
        evaluationData: {
          type: "text",
          text: "text",
        },
      };

      try {
        await evaluator.submitEvaluation(evaluation as HypercertEvaluationSchema);
      } catch (e) {
        expect(e).to.be.instanceOf(Error);
        const error = e as StorageError;
        expect(error.message).to.eq(`Unexpected evaluation source: ${evaluation.evaluationSource.toString()}`);
      }
    });

    it("should throw an error for invalid creator address", async () => {
      chai.Assertion.expectAssertions(2);

      const evaluation = {
        creator: "bob",
      };

      try {
        await evaluator.submitEvaluation(evaluation as HypercertEvaluationSchema);
      } catch (e) {
        expect(e).to.be.instanceOf(MalformedDataError);
        const error = e as MalformedDataError;
        expect(error.message).to.be.eq(`Invalid creator address: ${evaluation.creator.toString()}`);
      }
    });

    it("should throw an error for readonly storage", async () => {
      chai.Assertion.expectAssertions(2);

      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: signer?.address });

      const readonlyEvaluator = new HypercertEvaluator({
        chain: { id: 5 },
        easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
        publicClient,
      });

      try {
        await readonlyEvaluator.submitEvaluation(evaluation);
      } catch (e) {
        const error = e as Error;
        expect(error).to.be.instanceOf(Error);
        expect(error.message).to.match(/Unexpected evaluation source/);
      }

      sinon.restore();
    });
  });
});
