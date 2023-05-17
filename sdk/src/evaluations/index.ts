import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";
import { CIDString } from "nft.storage";

import { DEFAULT_CHAIN_ID } from "../constants.js";
import HypercertsStorage from "../storage.js";
import { InvalidOrMissingError, StorageError } from "../types/errors.js";
import { EasEvaluation, Evaluation, IpfsEvaluation } from "../types/evaluation.js";
import EasEvaluator from "./eas.js";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

type EvaluationTypes = EasEvaluation | IpfsEvaluation;

type HypercertEvaluatorConfig = {
  chainId: number;
  address: string;
  signer: ethers.Signer & TypedDataSigner;
  storage: HypercertsStorage;
};

export interface EvaluatorInterface {
  submitEvaluation: (evaluation: Evaluation) => Promise<CIDString>;
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

  submitEvaluation = async (evaluation: Evaluation): Promise<CIDString> => {
    if (this.storage.readonly) {
      throw new StorageError("Storage is in readonly mode");
    }

    let data;
    const evaluationData = evaluation.evaluation;
    if (isEasEvaluation(evaluationData)) {
      console.log("EAS");
      data = { ...evaluationData, signedData: await this.eas.signOfflineEvaluation(evaluation) };
    } else if (isIpfsEvaluation(evaluationData)) {
      console.log("IPFS");
      //TODO Do we want users to sign this as well? Or is IPFS more for any raw data?
      data = evaluationData;
    }

    if (!data) {
      throw new Error("No data found for evaluation");
    }

    evaluation.evaluation = data;

    return this.storage.storeData(data);
  };
}

const isEasEvaluation = (evaluation: EvaluationTypes): evaluation is EasEvaluation => {
  const validated = true;

  return validated;
};

const isIpfsEvaluation = (evaluation: EvaluationTypes): evaluation is IpfsEvaluation => {
  const validated = true;

  return validated;
};
