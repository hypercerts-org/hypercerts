import { Offchain, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";

import { DEFAULT_CHAIN_ID } from "../constants.js";
import { InvalidOrMissingError } from "../types/errors.js";
import { EasEvaluation, Evaluation } from "../types/evaluation.js";

type EasEvaluatorConfig = {
  address: string;
  chainId: number;
  signer: TypedDataSigner;
};

export default class EasEvaluator {
  offChain: Offchain;
  schemaEncoder: SchemaEncoder;
  signer: TypedDataSigner;

  constructor({
    config = { chainId: DEFAULT_CHAIN_ID, address: "", signer: new ethers.VoidSigner("") },
  }: {
    config?: EasEvaluatorConfig;
  }) {
    this.offChain = new Offchain({ address: config.address, chainId: config.chainId, version: "0.26" });
    this.schemaEncoder = new SchemaEncoder("uint256 chainId, address contract, uint256 claimId, string uri");
    this.signer = config.signer;
  }

  signOfflineEvaluation = async (evaluation: Evaluation) => {
    const evaluationData = evaluation.evaluation as EasEvaluation;
    // Initialize SchemaEncoder with the schema string
    const encodedData = this.schemaEncoder.encodeData([
      { name: "chainId", value: evaluationData.chainId, type: "uint256" },
      { name: "contract", value: evaluationData.contract, type: "address" },
      { name: "claimId", value: evaluation.hypercert.claimId, type: "uint256" },
      { name: "uri", value: evaluationData.uid, type: "string" },
    ]);

    if (!encodedData) {
      throw new InvalidOrMissingError("Encoding evaluation data returned invalid string", "encodedData");
    }

    // Example schema on Sepolia
    // https://sepolia.easscan.org/schema/view/0xbe6ab02c9907680b9b7d6eb8dac5b590eec64a30e863d6f2d1ce2d853990be27
    const offchainAttestation = await this.offChain.signOffchainAttestation(
      {
        // TODO who will be the recipient? The contract it points to? The creator?
        recipient: evaluation.hypercert.contract,
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: 0,
        // Unix timestamp of current time
        time: Date.now(),
        revocable: true,
        nonce: 0,
        schema: "0xbe6ab02c9907680b9b7d6eb8dac5b590eec64a30e863d6f2d1ce2d853990be27",
        refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      this.signer as TypedDataSigner,
    );

    return offchainAttestation;
  };
}
