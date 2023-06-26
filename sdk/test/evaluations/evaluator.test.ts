import { expect } from "@jest/globals";
import { providers } from "ethers";
import { Wallet, ethers } from "ethers";
import { CIDString } from "nft.storage";
import sinon from "sinon";

import HypercertEvaluator from "../../src/evaluations/index.js";
import HypercertsStorage from "../../src/storage.js";
import { InvalidOrMissingError, MalformedDataError, StorageError } from "../../src/types/errors.js";
import { HypercertEvaluationSchema } from "../../src/types/evaluation.js";
import { getEvaluationData } from "../helpers.js";
import { reloadEnv } from "../setup-tests.js";

describe("HypercertEvaluator", () => {
  let stubSubscription: sinon.SinonStub;
  let stubStorage: sinon.SinonStub;
  let signer: Wallet;
  let evaluator: HypercertEvaluator;
  const mockCid = "bafybeibxm2nsadl3fnxv2sxcxmxaco2jl53wpeorjdzidjwf5aqdg7wa6u";

  beforeAll(() => {
    stubSubscription = sinon.stub(providers.JsonRpcProvider.prototype, "on");
    signer = ethers.Wallet.createRandom();
    evaluator = new HypercertEvaluator({
      chainId: 5,
      easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
      operator: signer,
    });
    stubStorage = sinon.stub(evaluator.storage, "storeData").resolves(mockCid);
  });

  beforeEach(() => {
    sinon.resetHistory();
  });

  afterAll(() => {
    // reloadEnv();

    stubStorage.restore();
    stubSubscription.restore();
  });

  describe("submitEvaluation", () => {
    it("should submit an EAS evaluation", async () => {
      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: await signer.getAddress() });

      const result: CIDString = await evaluator.submitEvaluation(evaluation);

      console.log(result);

      expect(result).toEqual("bafybeibxm2nsadl3fnxv2sxcxmxaco2jl53wpeorjdzidjwf5aqdg7wa6u");
      sinon.assert.calledOnce(stubStorage);
    });

    it("should throw an error for missing signer", async () => {
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
        creator: await signer.getAddress(),
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

      const evaluation: HypercertEvaluationSchema = getEvaluationData({ creator: await signer.getAddress() });

      const readonlyEvaluator = new HypercertEvaluator({
        chainId: 5,
        easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
        operator: signer,
      });

      try {
        await readonlyEvaluator.submitEvaluation(evaluation);
      } catch (e) {
        expect(e).toBeInstanceOf(StorageError);
        let error = e as StorageError;
        expect(error.message).toEqual("Web3.storage client is not configured");
      }

      expect.assertions(2);
    });
  });
});
