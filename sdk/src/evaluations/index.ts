import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";
import { CIDString } from "nft.storage";

import { DEFAULT_CHAIN_ID } from "../constants.js";
import HypercertsStorage from "../storage.js";
import { StorageError } from "../types/errors.js";
import { EASEvaluation, EvaluationSource, HypercertEvaluationSchema, IPFSEvaluation } from "../types/evaluation.js";
import EasEvaluator from "./eas.js";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

type HypercertEvaluatorConfig = {
  chainId: number;
  address: string;
  signer: ethers.Signer & TypedDataSigner;
  storage: HypercertsStorage;
};

export interface EvaluatorInterface {
  submitEvaluation: (evaluation: HypercertEvaluationSchema) => Promise<CIDString>;
}

export default class HypercertEvaluator implements EvaluatorInterface {
  signer: ethers.Signer & TypedDataSigner;
  storage: HypercertsStorage;
  eas: EasEvaluator;

  constructor({
    config = {
      chainId: DEFAULT_CHAIN_ID,
      address: EASContractAddress,
      signer: new ethers.VoidSigner(""),
      storage: new HypercertsStorage({}),
    },
  }: {
    config?: HypercertEvaluatorConfig;
  }) {
    this.signer = config.signer;
    this.storage = config.storage;
    this.eas = new EasEvaluator({
      config: {
        address: config.address,
        chainId: config.chainId,
        signer: this.signer,
      },
    });
  }

  submitEvaluation = async (evaluation: HypercertEvaluationSchema): Promise<CIDString> => {
    if (this.storage.readonly) {
      throw new StorageError("Storage is in readonly mode");
    }

    if (isEasEvaluation(evaluation.evaluationSource)) {
      const signedData = await this.eas.signOfflineEvaluation(evaluation.evaluationData);
      const evaluationData = { ...evaluation.evaluationData, ...signedData };
      const evaluationToStore = { ...evaluation, evaluationData };

      return this.storage.storeData(evaluationToStore);
    }

    throw new Error(`Unexpected evaluation source: ${evaluation.evaluationSource}`);
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
