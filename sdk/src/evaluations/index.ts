import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils";
import { CIDString } from "nft.storage";

import HypercertsStorage from "../storage";
import {
  EASEvaluation,
  EvaluationSource,
  HypercertClientConfig,
  HypercertEvaluationSchema,
  MalformedDataError,
} from "../types";
import EasEvaluator from "./eas";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

export interface EvaluatorInterface {
  /**
   * Submits an evaluation to the prefered storage system.
   * @param {HypercertEvaluationSchema} evaluation - The evaluation to submit.
   * @returns {Promise<CIDString>} - The CID of the submitted evaluation.
   */
  submitEvaluation: (evaluation: HypercertEvaluationSchema) => Promise<CIDString>;
}

export default class HypercertEvaluator implements EvaluatorInterface {
  signer?: ethers.Signer & TypedDataSigner;

  storage: HypercertsStorage;

  eas: EasEvaluator;

  readonly = true;

  constructor(
    config = {
      easContractAddress: EASContractAddress,
      operator: new ethers.VoidSigner(""),
    } as Partial<HypercertClientConfig>,
  ) {
    //TODO when expanding the Evaluator functionallity, we should review if readonly makes sense
    if (ethers.Signer.isSigner(config.operator)) {
      this.signer = config.operator as ethers.Signer & TypedDataSigner;
      this.readonly = false;
    }
    this.storage = new HypercertsStorage(config);
    this.eas = new EasEvaluator(config);
  }

  submitEvaluation = async (evaluation: HypercertEvaluationSchema): Promise<CIDString> => {
    if (!isAddress(evaluation.creator)) {
      throw new MalformedDataError(`Invalid creator address: ${evaluation.creator}`);
    }

    if (isEasEvaluation(evaluation.evaluationSource)) {
      const signedData = await this.eas.signOfflineEvaluation(evaluation.evaluationData);
      const evaluationData = { ...evaluation.evaluationData, signedData };

      return this.storage.storeData({ ...evaluation, evaluationData });
    }

    throw new Error(`Unexpected evaluation source: ${evaluation.evaluationSource.toString()}`);
  };
}

const isEasEvaluation = (evaluationSource: EvaluationSource): evaluationSource is EASEvaluation => {
  return (
    evaluationSource.type === "EAS" &&
    "chainId" in evaluationSource &&
    "contract" in evaluationSource &&
    "uid" in evaluationSource
  );
};
