import HypercertEvaluator, { EvaluatorInterface } from "../../src/evaluations/index.js";
import HypercertsStorage from "../../src/storage.js";
import { HypercertEvaluationSchema } from "../../src/types/evaluation.js";
import { CIDString } from "nft.storage";
import { MockProvider } from "ethereum-waffle";
import { reloadEnv } from "../setup-tests.js";
import { expect, jest } from "@jest/globals";
import { getEvaluationData } from "../helpers.js";
import { StorageError } from "../../src/types/errors.js";

describe("HypercertEvaluator", () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  const signer = wallet.connect(provider);
  const storage = new HypercertsStorage({});

  const evaluator: EvaluatorInterface = new HypercertEvaluator({
    chainId: 1,
    address: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    signer,
    storage,
  });

  afterEach(() => {
    // jest.resetModules();
    reloadEnv();
  });

  describe("submitEvaluation", () => {
    it("should submit an EAS evaluation", async () => {
      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: signer.address });

      const storeDataSpy = jest
        .spyOn(storage, "storeData")
        .mockResolvedValue("bafybeibxm2nsadl3fnxv2sxcxmxaco2jl53wpeorjdzidjwf5aqdg7wa6u");

      const result: CIDString = await evaluator.submitEvaluation(evaluation);

      expect(result).toEqual("bafybeibxm2nsadl3fnxv2sxcxmxaco2jl53wpeorjdzidjwf5aqdg7wa6u");
      expect(storeDataSpy).toHaveBeenCalledTimes(1);

      storeDataSpy.mockReset();
    });

    it("should throw an error for missing signer", async () => {
      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: signer.address });

      const readonlyEvaluator: EvaluatorInterface = new HypercertEvaluator({});

      console.log(readonlyEvaluator);

      await expect(readonlyEvaluator.submitEvaluation(evaluation)).rejects.toThrowError(
        /VoidSigner cannot sign typed data/,
      );
    });

    it("should throw an error for readonly storage", async () => {
      delete process.env.NFT_STORAGE_TOKEN;
      delete process.env.WEB3_STORAGE_TOKEN;
      delete process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
      delete process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: signer.address });

      const readonlyEvaluator: EvaluatorInterface = new HypercertEvaluator({ signer });

      try {
        await readonlyEvaluator.submitEvaluation(evaluation);
      } catch (e) {
        expect(e).toBeInstanceOf(StorageError);
        let error = e as StorageError;
        expect(error.message).toEqual("Web3.storage client is not configured");
      }

      expect.assertions(2);
    });

    it("should throw an error for unexpected evaluation source", async () => {
      const evaluation = {
        evaluationSource: {
          type: "invalid",
        },
        evaluationData: {
          type: "text",
          text: "text",
        },
      };

      await expect(evaluator.submitEvaluation(evaluation as HypercertEvaluationSchema)).rejects.toThrowError(
        /Unexpected evaluation source:/,
      );
    });
  });
});
