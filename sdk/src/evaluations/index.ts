import { isAddress } from "viem";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString } from "nft.storage";

import HypercertsStorage from "../storage";
import { HypercertClientConfig, HypercertEvaluationSchema, MalformedDataError } from "../types";

export interface EvaluatorInterface {
  /**
   * Submits an evaluation to the prefered storage system.
   * @param {HypercertEvaluationSchema} evaluation - The evaluation to submit.
   * @returns {Promise<CIDString>} - The CID of the submitted evaluation.
   */
  submitEvaluation: (evaluation: HypercertEvaluationSchema) => Promise<CIDString>;
}

export default class HypercertEvaluator implements EvaluatorInterface {
  storage: HypercertsStorage;

  readonly = true;

  constructor(config: Partial<HypercertClientConfig>) {
    //TODO when expanding the Evaluator functionallity, we should review if readonly makes sense
    if (config?.walletClient?.account) {
      this.readonly = false;
    }

    this.storage = new HypercertsStorage(config);
  }

  submitEvaluation = async (evaluation: HypercertEvaluationSchema): Promise<CIDString> => {
    if (!isAddress(evaluation.creator)) {
      throw new MalformedDataError(`Invalid creator address: ${evaluation.creator}`);
    }

    throw new Error(`Unexpected evaluation source: ${evaluation.evaluationSource.toString()}`);
  };
}
