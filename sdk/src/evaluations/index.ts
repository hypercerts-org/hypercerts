import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";
import { CIDString } from "nft.storage";

import { DEFAULT_CHAIN_ID } from "../constants.js";
import HypercertsStorage from "../storage.js";
import { MalformedDataError, StorageError } from "../types/errors.js";
import { EASEvaluation, EvaluationSource, HypercertEvaluationSchema, IPFSEvaluation } from "../types/evaluation.js";
import EasEvaluator from "./eas.js";
import { isAddress } from "ethers/lib/utils.js";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

type HypercertEvaluatorConfig = {
  chainId?: number;
  address?: string;
  signer?: ethers.Signer & TypedDataSigner;
  storage?: HypercertsStorage;
};

export interface EvaluatorInterface {
  submitEvaluation: (evaluation: HypercertEvaluationSchema) => Promise<CIDString>;
}

export default class HypercertEvaluator implements EvaluatorInterface {
  signer: ethers.Signer & TypedDataSigner;
  storage: HypercertsStorage;
  eas: EasEvaluator;

  constructor({
    chainId = DEFAULT_CHAIN_ID,
    address = EASContractAddress,
    signer = new ethers.VoidSigner(""),
    storage = new HypercertsStorage({}),
  }: HypercertEvaluatorConfig) {
    this.signer = signer;
    this.storage = storage;
    this.eas = new EasEvaluator({
      address,
      chainId,
      signer: this.signer,
    });
  }

  submitEvaluation = async (evaluation: HypercertEvaluationSchema): Promise<CIDString> => {
    if (!isAddress(evaluation.creator)) {
      throw new MalformedDataError(`Invalid creator address: ${evaluation.creator}`);
    }

    if (isEasEvaluation(evaluation.evaluationSource)) {
      const signedData = await this.eas.signOfflineEvaluation(evaluation.evaluationData);
      const evaluationData = { ...evaluation.evaluationData, signedData };
      const evaluationToStore = { ...evaluation, evaluationData };

      return this.storage.storeData(evaluationToStore);
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
