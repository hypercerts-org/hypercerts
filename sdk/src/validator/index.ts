import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import Ajv from "ajv";

import claimDataSchema from "../resources/schema/claimdata.json";
import evaluationSchema from "../resources/schema/evaluation.json";
import metaDataSchema from "../resources/schema/metadata.json";
import {
  AllowlistEntry,
  DuplicateEvaluation,
  HypercertClaimdata,
  HypercertMetadata,
  MintingError,
  SimpleTextEvaluation,
} from "../types";
import { isAddress } from "viem";

const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
ajv.addSchema(metaDataSchema, "metaData");
ajv.addSchema(claimDataSchema, "claimData");
ajv.addSchema(evaluationSchema, "evaluation.json");

/**
 * The result of a validation.
 * @property valid - Whether the data is valid.
 * @property errors - A map of errors, where the key is the field that failed validation and the value is the error message.
 */
type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

/**
 * Validates the data for a simple text evaluation.
 * @param data The data to validate.
 * @returns A `ValidationResult` object indicating whether the data is valid and any errors that were found.
 */
const validateMetaData = (data: HypercertMetadata): ValidationResult => {
  const schemaName = "metaData";
  const validate = ajv.getSchema<HypercertMetadata>(schemaName);
  if (!validate) {
    return { valid: false, errors: { schema: "Schema not found" } };
  }

  if (!validate(data)) {
    const errors: Record<string, string> = {};
    for (const e of validate.errors || []) {
      const key = e.params.missingProperty || "other";
      if (key && e.message) {
        errors[key] = e.message;
      }
    }
    return { valid: false, errors };
  }

  return { valid: true, errors: {} };
};

/**
 * Validates the data for a simple text evaluation.
 * @param data The data to validate.
 * @returns A `ValidationResult` object indicating whether the data is valid and any errors that were found.
 */
const validateClaimData = (data: HypercertClaimdata): ValidationResult => {
  const schemaName = "claimData";
  const validate = ajv.getSchema<HypercertClaimdata>(schemaName);
  if (!validate) {
    return { valid: false, errors: { schema: "Schema not found" } };
  }

  if (!validate(data)) {
    const errors: Record<string, string> = {};
    for (const e of validate.errors || []) {
      const key = e.params.missingProperty || "other";
      if (key && e.message) {
        errors[key] = e.message;
      }
    }
    return { valid: false, errors };
  }

  return { valid: true, errors: {} };
};

/**
 * Validates the data for an allowlist.
 * @param data The data to validate.
 * @param units The total number of units in the allowlist.
 * @returns A `ValidationResult` object indicating whether the data is valid and any errors that were found.
 */
const validateAllowlist = (data: AllowlistEntry[], units: bigint) => {
  const errors: Record<string, string | string[]> = {};
  const totalUnits = data.reduce((acc, curr) => acc + BigInt(curr.units.toString()), 0n);
  if (totalUnits != units) {
    errors[
      "units"
    ] = `Total units in allowlist must match total units [expected: ${units}, got: ${totalUnits.toString()}]`;
  }

  if (totalUnits == 0n) {
    errors["units"] = "Total units in allowlist must be greater than 0";
  }

  const filteredAddresses = data.filter((entry) => !isAddress(entry.address));
  if (filteredAddresses.length > 0) {
    errors["address"] = filteredAddresses.map((entry) => entry.address);
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

/**
 * Validates the data for a duplicate evaluation.
 * @param data The data to validate.
 * @returns A `ValidationResult` object indicating whether the data is valid and any errors that were found.
 */
const validateDuplicateEvaluationData = (data: DuplicateEvaluation): ValidationResult => {
  const validate = ajv.getSchema<DuplicateEvaluation>("evaluation.json#/definitions/DuplicateEvaluation");
  if (!validate) {
    return { valid: false, errors: { schema: "Schema not found" } };
  }

  if (!validate(data)) {
    const errors: Record<string, string> = {};
    for (const e of validate.errors || []) {
      const key = e.params.missingProperty || "other";
      if (key && e.message) {
        errors[key] = e.message;
      }
    }
    return { valid: false, errors };
  }

  return { valid: true, errors: {} };
};

/**
 * Validates the data for a simple text evaluation.
 * @param data The data to validate.
 * @returns A `ValidationResult` object indicating whether the data is valid and any errors that were found.
 */
const validateSimpleTextEvaluationData = (data: SimpleTextEvaluation): ValidationResult => {
  const validate = ajv.getSchema<SimpleTextEvaluation>("evaluation.json#/definitions/SimpleTextEvaluation");
  if (!validate) {
    return { valid: false, errors: { schema: "Schema not found" } };
  }

  if (!validate(data)) {
    const errors: Record<string, string> = {};
    for (const e of validate.errors || []) {
      const key = e.params.missingProperty || "other";
      if (key && e.message) {
        errors[key] = e.message;
      }
    }
    return { valid: false, errors };
  }

  return { valid: true, errors: {} };
};

/**
 * Verifies a Merkle proof for a given address and units.
 * @param root The Merkle root hash to verify against.
 * @param signerAddress The address to verify.
 * @param units The units to verify.
 * @param proof The Merkle proof to verify.
 * @throws {MintingError} If the Merkle proof verification fails.
 */
function verifyMerkleProof(root: string, signerAddress: string, units: bigint, proof: string[]): void {
  if (!isAddress(signerAddress)) {
    throw new MintingError("Invalid address", { signerAddress });
  }

  const verified = StandardMerkleTree.verify(root, ["address", "uint256"], [signerAddress, units], proof);
  if (!verified) {
    throw new MintingError("Merkle proof verification failed", { root, proof });
  }
}

/**
 * Batch verifies Merkle proofs for multiple roots, units and proofs for a single address
 * @param roots The Merkle root hashes to verify against.
 * @param signerAddress The address to verify.
 * @param units The units to verify.
 * @param proofs The Merkle proofs to verify.
 * @throws {MintingError} If the Merkle proof verification fails.
 * @notice Wrapper around `verifyMerkleProof` to batch verify multiple proofs
 */
function verifyMerkleProofs(roots: string[], signerAddress: string, units: bigint[], proofs: string[][]) {
  if (roots.length !== units.length || units.length !== proofs.length) {
    throw new MintingError("Invalid input", { roots, units, proofs });
  }

  for (let i = 0; i < roots.length; i++) {
    verifyMerkleProof(roots[i], signerAddress, units[i], proofs[i]);
  }
}

export {
  validateMetaData,
  validateClaimData,
  validateAllowlist,
  verifyMerkleProof,
  verifyMerkleProofs,
  validateDuplicateEvaluationData,
  validateSimpleTextEvaluationData,
};
