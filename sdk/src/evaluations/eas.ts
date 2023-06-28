import { Offchain, SchemaEncoder, SignedOffchainAttestation } from "@ethereum-attestation-service/eas-sdk";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";

import { EAS_SCHEMAS } from "../constants.js";
import {
  MalformedDataError,
  DuplicateEvaluation,
  EvaluationData,
  SimpleTextEvaluation,
  HypercertClientConfig,
  InvalidOrMissingError,
} from "../types/index.js";
import { validateDuplicateEvaluationData, validateSimpleTextEvaluationData } from "../validator/index.js";

/**
 * The EasEvaluator class provides methods for signing off-chain attestations of evaluations.
 * Schemas are stored on-chain in the Ethereum Attestation Service (EAS) contract.
 */
export default class EasEvaluator {
  /**
   * The Offchain instance used for signing off-chain attestations.
   */
  offChain: Offchain;

  /**
   * The TypedDataSigner instance used for signing typed data.
   */
  signer: ethers.Signer & TypedDataSigner;

  /**
   * Creates a new EasEvaluator instance.
   * @param {EasEvaluatorConfig} config - The configuration options for the EasEvaluator instance.
   */
  constructor(config: Partial<HypercertClientConfig>) {
    for (const prop of ["easContractAddress", "chainId", "signer"]) {
      if (!(prop in config) || config[prop as keyof HypercertClientConfig] === undefined) {
        throw new InvalidOrMissingError(`Invalid or missing config value: ${prop}`, { prop: prop.toString() });
      }
    }

    this.offChain = new Offchain({ address: config.easContractAddress!, chainId: config.chainId!, version: "0.26" });
    this.signer = config.signer as ethers.Signer & TypedDataSigner;
  }

  /**
   * Gets a signature for an off-chain attestation.
   * @param {string} encodedData - The encoded data to sign.
   * @param {string} recipient - The address of the recipient of the attestation.
   * @param {string} schemaUid - The UID of the schema to use for the attestation.
   * @returns {Promise<SignedOffchainAttestation>} - The signature for the attestation.
   */
  getSignature = async (
    encodedData: string,
    recipient: string,
    schemaUid: string,
  ): Promise<SignedOffchainAttestation> => {
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
        schema: schemaUid,
        refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      this.signer,
    );
  };

  /**
   * Signs an offline evaluation.
   * @param {EvaluationData} evaluation - The evaluation data to sign.
   * @returns {Promise<SignedOffchainAttestation>} - The signature for the evaluation.
   * @throws {MalformedDataError} - If the evaluation data is malformed.
   */
  signOfflineEvaluation = async (evaluation: EvaluationData) => {
    if (isDuplicateEvaluation(evaluation)) {
      const validation = validateDuplicateEvaluationData(evaluation);
      if (!validation.valid) {
        throw new MalformedDataError("Invalid evaluation data", { errors: validation.errors });
      }

      const duplicateSchema = EAS_SCHEMAS["sepolia"].duplicate;
      const schemaEncoder = new SchemaEncoder(duplicateSchema.schema);
      const recipient = evaluation.realHypercert.contract;

      // Initialize SchemaEncoder with the schema string
      // TODO validate schema values
      const encodedData = schemaEncoder.encodeData([
        { name: "chainId", value: evaluation.realHypercert.chainId as string, type: "uint256" },
        { name: "contract", value: evaluation.realHypercert.contract as string, type: "address" },
        { name: "claimId", value: evaluation.realHypercert.claimId as string, type: "uint256" },
      ]);

      return this.getSignature(encodedData, recipient, duplicateSchema.uid);
    }

    if (isSimpleTextEvaluation(evaluation)) {
      const validation = validateSimpleTextEvaluationData(evaluation);
      if (!validation.valid) {
        throw new MalformedDataError("Invalid evaluation data", { errors: validation.errors });
      }

      const simpleTextSchema = EAS_SCHEMAS["sepolia"].contentHash;
      const schemaEncoder = new SchemaEncoder(simpleTextSchema.schema);
      const recipient = evaluation.hypercert.contract;

      const contentHash = ethers.utils.id(evaluation.text);

      // Initialize SchemaEncoder with the schema string
      // TODO validate schema values
      const encodedData = schemaEncoder.encodeData([{ name: "contentHash", value: contentHash, type: "bytes32" }]);

      return this.getSignature(encodedData, recipient, simpleTextSchema.uid);
    }

    assertNever(evaluation);
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
