import { Offchain, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";

import { DEFAULT_CHAIN_ID, EAS_SCHEMAS } from "../constants.js";
import { InvalidOrMissingError } from "../types/errors.js";
import { DuplicateEvaluation, EvaluationData } from "../types/evaluation.js";

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

  signOfflineEvaluation = async (evaluation: EvaluationData) => {
    let encodedData;
    if (evaluation.type === "duplicate") {
      const data = evaluation.evaluation as DuplicateEvaluation;
      const realHypercert = data.realHypercert;
      const schemaEncoder = new SchemaEncoder(EAS_SCHEMAS["sepolia"].duplicate.schema);

      // Initialize SchemaEncoder with the schema string
      // TODO validate schema values
      encodedData = schemaEncoder.encodeData([
        { name: "chainId", value: realHypercert.chainId as string, type: "uint256" },
        { name: "contract", value: realHypercert.contract as string, type: "address" },
        { name: "claimId", value: realHypercert.claimId as string, type: "uint256" },
      ]);
    }

    if (!encodedData) {
      throw new InvalidOrMissingError("Encoding evaluation data returned invalid string", "encodedData");
    }

    // Example schema on Sepolia
    // https://sepolia.easscan.org/schema/view/0xe542f797c9407ccb56e539d14c83718bf35c1d0f3c768bc2623aca56badfde51
    const offchainAttestation = await this.offChain.signOffchainAttestation(
      {
        // TODO who will be the recipient? The contract it points to? The creator?
        recipient: evaluation.evaluation.realHypercert.contract,
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: 0,
        // Unix timestamp of current time
        time: Date.now(),
        revocable: true,
        nonce: 0,
        schema: "0xe542f797c9407ccb56e539d14c83718bf35c1d0f3c768bc2623aca56badfde51",
        refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      this.signer as TypedDataSigner,
    );

    return offchainAttestation;
  };
}
