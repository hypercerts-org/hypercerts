import { Offchain, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";

import { DEFAULT_CHAIN_ID, EAS_SCHEMAS } from "../constants.js";
import { InvalidOrMissingError, MalformedDataError } from "../types/errors.js";
import { DuplicateEvaluation, EvaluationData, SimpleTextEvaluation } from "../types/evaluation.js";
import { validateDuplicateEvaluationData, validateSimpleTextEvaluationData } from "src/validator/index.js";

type EasEvaluatorConfig = {
  address: string;
  chainId: number;
  signer: TypedDataSigner;
};

export default class EasEvaluator {
  offChain: Offchain;
  signer: TypedDataSigner;

  constructor({
    config = { chainId: DEFAULT_CHAIN_ID, address: "", signer: new ethers.VoidSigner("") },
  }: {
    config?: EasEvaluatorConfig;
  }) {
    this.offChain = new Offchain({ address: config.address, chainId: config.chainId, version: "0.26" });
    this.signer = config.signer;
  }

  getSignature = async (encodedData: string, recipient: string, schema: string) => {
    return await this.offChain.signOffchainAttestation(
      {
        // TODO who will be the recipient? The contract it points to? The creator?
        recipient,
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: 0,
        // Unix timestamp of current time
        time: Date.now(),
        revocable: true,
        nonce: 0,
        schema,
        refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      this.signer as TypedDataSigner,
    );
  };

  signOfflineEvaluation = async (evaluation: EvaluationData) => {
    if (isDuplicateEvaluation(evaluation)) {
      const validation = validateDuplicateEvaluationData(evaluation);
      if (!validation.valid) {
        throw new MalformedDataError("Invalid evaluation data", { errors: validation.errors });
      }

      const schema = EAS_SCHEMAS["sepolia"].duplicate.schema;
      const schemaEncoder = new SchemaEncoder(schema);
      const recipient = evaluation.realHypercert.contract;

      // Initialize SchemaEncoder with the schema string
      // TODO validate schema values
      const encodedData = schemaEncoder.encodeData([
        { name: "chainId", value: evaluation.realHypercert.chainId as string, type: "uint256" },
        { name: "contract", value: evaluation.realHypercert.contract as string, type: "address" },
        { name: "claimId", value: evaluation.realHypercert.claimId as string, type: "uint256" },
      ]);

      return this.getSignature(encodedData, recipient, schema);
    }

    if (isSimpleTextEvaluation(evaluation)) {
      const validation = validateSimpleTextEvaluationData(evaluation);
      if (!validation.valid) {
        throw new MalformedDataError("Invalid evaluation data", { errors: validation.errors });
      }

      const schema = EAS_SCHEMAS["sepolia"].contentHash.schema;
      const schemaEncoder = new SchemaEncoder(schema);
      const recipient = evaluation.hypercert.contract;

      const contentHash = ethers.utils.id(evaluation.text);

      // Initialize SchemaEncoder with the schema string
      // TODO validate schema values
      const encodedData = schemaEncoder.encodeData([{ name: "contentHash", value: contentHash, type: "bytes32" }]);

      return this.getSignature(encodedData, recipient, schema);
    }

    if (assertNever(evaluation)) {
      throw new InvalidOrMissingError("Encoding evaluation data returned invalid string", "encodedData");
    }
  };
}

const isDuplicateEvaluation = (evaluation: EvaluationData): evaluation is DuplicateEvaluation => {
  return (
    evaluation.type === "duplicate" &&
    "realHypercert" in evaluation &&
    "duplicateHypercerts" in evaluation &&
    "explanation" in evaluation
  );
};

const isSimpleTextEvaluation = (evaluation: EvaluationData): evaluation is SimpleTextEvaluation => {
  return evaluation.type === "simpleText" && "hypercert" in evaluation && "text" in evaluation;
};

const assertNever = (evaluation: never): never => {
  throw new Error(`Unexpected evaluation type: ${evaluation}`);
};
