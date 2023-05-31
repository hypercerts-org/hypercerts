import HypercertEvaluator, { EvaluatorInterface } from "../../src/evaluations/index.js";
import HypercertsStorage from "../../src/storage.js";
import { HypercertEvaluationSchema } from "../../src/types/evaluation.js";
import { CIDString } from "nft.storage";
import { MockProvider } from "ethereum-waffle";
import { reloadEnv } from "../setup-tests.js";
import { expect, jest } from "@jest/globals";
import { getEvaluationData } from "../helpers.js";
import { InvalidOrMissingError, MalformedDataError, StorageError } from "../../src/types/errors.js";

jest.mock("../../src/storage.js");

describe("HypercertEvaluator", () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  const signer = wallet.connect(provider);

  const evaluator = new HypercertEvaluator({
    chainId: 5,
    easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
    signer,
  });

  afterEach(() => {
    jest.restoreAllMocks();
    reloadEnv();
  });

  describe("submitEvaluation", () => {
    it("should submit an EAS evaluation", async () => {
      const mockStoredata = jest.spyOn(HypercertsStorage.prototype, "storeData");

      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: signer.address });

      mockStoredata.mockResolvedValue("bafybeibxm2nsadl3fnxv2sxcxmxaco2jl53wpeorjdzidjwf5aqdg7wa6u");

      const result: CIDString = await evaluator.submitEvaluation(evaluation);

      expect(result).toEqual("bafybeibxm2nsadl3fnxv2sxcxmxaco2jl53wpeorjdzidjwf5aqdg7wa6u");
      expect(mockStoredata).toHaveBeenCalledTimes(1);

      mockStoredata.mockClear();
    });

    it("should throw an error for missing signer", async () => {
      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: signer.address });

      try {
        new HypercertEvaluator({
          chainId: 5,
          easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
        });
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidOrMissingError);
        let error = e as InvalidOrMissingError;
        expect(error.message).toEqual("Invalid or missing config value: signer");
      }

      expect.assertions(2);
    });

    it("should throw an error for unexpected evaluation source", async () => {
      const evaluation = {
        creator: signer.address,
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
        let error = e as StorageError;
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
        let error = e as MalformedDataError;
        expect(error.message).toEqual(`Invalid creator address: ${evaluation.creator.toString()}`);
      }

      expect.assertions(2);
    });

    it("should throw an error for readonly storage", async () => {
      delete process.env.NFT_STORAGE_TOKEN;
      delete process.env.WEB3_STORAGE_TOKEN;
      delete process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
      delete process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: signer.address });

      const readonlyEvaluator = new HypercertEvaluator({
        chainId: 5,
        easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
        signer,
      });

      try {
        const cid = await readonlyEvaluator.submitEvaluation(evaluation);
        console.log(cid);
      } catch (e) {
        expect(e).toBeInstanceOf(StorageError);
        let error = e as StorageError;
        expect(error.message).toEqual("Web3.storage client is not configured");
      }

      expect.assertions(2);
    });
  });
});
