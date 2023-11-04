import { expect } from "@jest/globals";
import sinon from "sinon";

import HypercertEvaluator from "../../src/evaluations/index.js";
import { MalformedDataError, StorageError } from "../../src/types/errors.js";
import { HypercertEvaluationSchema } from "../../src/types/evaluation.js";
import { getEvaluationData, publicClient, walletClient } from "../helpers.js";

describe("HypercertEvaluator", () => {
  const signer = walletClient.account;
  const evaluator = new HypercertEvaluator({
    id: 5,
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
      sinon.stub(process, "env").value({ NFT_STORAGE_TOKEN: null });
      sinon.stub(process, "env").value({ WEB3_STORAGE_TOKEN: null });
      sinon.stub(process, "env").value({ NEXT_PUBLIC_NFT_STORAGE_TOKEN: null });
      sinon.stub(process, "env").value({ NEXT_PUBLIC_WEB3_STORAGE_TOKEN: null });

      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: signer?.address });

      const readonlyEvaluator = new HypercertEvaluator({
        id: 5,
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
