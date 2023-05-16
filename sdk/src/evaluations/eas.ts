import { Offchain, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { ethers } from "ethers";
import { InvalidOrMissingError } from "src/types/errors.js";

import { DEFAULT_CHAIN_ID } from "../constants.js";

type EASConfigType = {
  address: string;
  version: string;
  chainId: number;
};

type Evaluation = {
  claimId: string;
  contract: string;
  uri: string;
};

export default class EasAttestor {
  EAS_CONFIG: EASConfigType;
  offChain: Offchain;
  schemaEncoder: SchemaEncoder;
  signer: TypedDataSigner;

  constructor({
    config = { chainId: DEFAULT_CHAIN_ID, address: "", signer: new ethers.VoidSigner("") },
  }: {
    config?: { address: string; chainId: number; signer: TypedDataSigner };
  }) {
    this.EAS_CONFIG = {
      address: config.address,
      version: "0.26",
      chainId: config?.chainId,
    };

    this.offChain = new Offchain(this.EAS_CONFIG);
    this.schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
    this.signer = config.signer;
  }

  submitEvaluation = async (evaluation: Evaluation) => {
    // Initialize SchemaEncoder with the schema string
    const encodedData = this.schemaEncoder.encodeData([
      { name: "claimId", value: evaluation.claimId, type: "uint256" },
      { name: "contract", value: evaluation.contract, type: "address" },
      { name: "uri", value: evaluation.uri, type: "string" },
    ]);

    if (!encodedData) {
      throw new InvalidOrMissingError("Encoding evaluation data returned invalid string", "encodedData");
    }

    const offchainAttestation = await this.offChain.signOffchainAttestation(
      {
        recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
        // Unix timestamp of when attestation expires. (0 for no expiration)
        expirationTime: 0,
        // Unix timestamp of current time
        time: Date.now(),
        revocable: true,
        nonce: 0,
        schema: "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
        refUID: "0x0000000000000000000000000000000000000000000000000000000000000000",
        data: encodedData,
      },
      this.signer as TypedDataSigner,
    );

    return offchainAttestation;
  };
}
