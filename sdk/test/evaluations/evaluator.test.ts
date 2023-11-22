import { expect } from "@jest/globals";
import sinon from "sinon";

import HypercertEvaluator from "../../src/evaluations";
import { MalformedDataError, StorageError } from "../../src/types/errors";
import { HypercertEvaluationSchema } from "../../src/types/evaluation";
import { getEvaluationData, publicClient, walletClient } from "../helpers";

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
        expect(e).toBeInstanceOf(Error);
        const error = e as StorageError;
        expect(error.message).toEqual(`Unexpected evaluation source: ${evaluation.evaluationSource.toString()}`);
      }

      expect.assertions(2);
    });

    it("should throw an error for invalid creator address", async () => {
      const evaluation = {
        creator: "bob",
      };

      try {
        await evaluator.submitEvaluation(evaluation as HypercertEvaluationSchema);
      } catch (e) {
        expect(e).toBeInstanceOf(MalformedDataError);
        const error = e as MalformedDataError;
        expect(error.message).toEqual(`Invalid creator address: ${evaluation.creator.toString()}`);
      }

      expect.assertions(2);
    });

    it("should throw an error for readonly storage", async () => {
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
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/Unexpected evaluation source/);
      }

      expect.assertions(2);
      sinon.restore();
    });
  });
});
