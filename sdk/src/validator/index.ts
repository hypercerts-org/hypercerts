import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import Ajv from "ajv";

import claimDataSchema from "../resources/schema/claimdata.json";
import evaluationSchema from "../resources/schema/evaluation.json";
import metaDataSchema from "../resources/schema/metadata.json";
import { AllowlistEntry, HypercertClaimdata, HypercertMetadata, MintingError } from "../types";
import { isAddress } from "viem";

//TODO replace with ZOD
const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
ajv.addSchema(metaDataSchema, "metaData");
ajv.addSchema(claimDataSchema, "claimData");
ajv.addSchema(evaluationSchema, "evaluation.json");

/**
 * Represents the result of a validation operation.
 *
 * This type is used to return the result of validating data against a schema. It includes a `valid` flag that indicates
 * whether the data is valid, and an `errors` object that contains any errors that occurred during validation.
 *
 */
type ValidationResult = {
  data: AllowlistEntry[] | HypercertClaimdata | HypercertMetadata | unknown;
  valid: boolean;
  errors: Record<string, string | string[]>;
};

/**
 * Validates Hypercert metadata.
 *
 * This function uses the AJV library to validate the metadata. It first retrieves the schema for the metadata,
 * then validates the data against the schema. If the schema is not found, it returns an error. If the data does not
 * conform to the schema, it returns the validation errors. If the data is valid, it returns a success message.
 *
 * @param {unknown} data - The metadata to validate. This should be an object that conforms to the HypercertMetadata type.
 * @returns {ValidationResult} An object that includes a validity flag and any errors that occurred during validation.
 */
const validateMetaData = (data: unknown): ValidationResult => {
  const schemaName = "metaData";
  const validate = ajv.getSchema<HypercertMetadata>(schemaName);
  if (!validate) {
    return { data, valid: false, errors: { schema: "Schema not found" } };
  }

  if (!validate(data)) {
    const errors: Record<string, string> = {};
    for (const e of validate.errors || []) {
      const key = e.params.missingProperty || "other";
      if (key && e.message) {
        errors[key] = e.message;
      }
    }
    return { data: data as unknown, valid: false, errors };
  }

  return { data: data as HypercertMetadata, valid: true, errors: {} };
};

/**
 * Validates Hypercert claim data.
 *
 * This function uses the AJV library to validate the claim data. It first retrieves the schema for the claim data,
 * then validates the data against the schema. If the schema is not found, it returns an error. If the data does not
 * conform to the schema, it returns the validation errors. If the data is valid, it returns a success message.
 *
 * @param {unknown} data - The claim data to validate. This should be an object that conforms to the HypercertClaimdata type.
 * @returns {ValidationResult} An object that includes a validity flag and any errors that occurred during validation.
 */
const validateClaimData = (data: unknown): ValidationResult => {
  const schemaName = "claimData";
  const validate = ajv.getSchema<HypercertClaimdata>(schemaName);
  if (!validate) {
    return { data, valid: false, errors: { schema: "Schema not found" } };
  }

  if (!validate(data)) {
    const errors: Record<string, string> = {};
    for (const e of validate.errors || []) {
      const key = e.params.missingProperty || "other";
      if (key && e.message) {
        errors[key] = e.message;
      }
    }
    return { data: data as unknown, valid: false, errors };
  }

  return { data: data as HypercertClaimdata, valid: true, errors: {} };
};

/**
 * Validates an array of allowlist entries.
 *
 * This function checks that the total units in the allowlist match the expected total units, that the total units are greater than 0,
 * and that all addresses in the allowlist are valid Ethereum addresses. It returns an object that includes a validity flag and any errors that occurred during validation.
 *
 * @param {AllowlistEntry[]} data - The allowlist entries to validate. Each entry should be an object that includes an address and a number of units.
 * @param {bigint} units - The expected total units in the allowlist.
 * @returns {ValidationResult} An object that includes a validity flag and any errors that occurred during validation. The keys in the errors object are the names of the invalid properties, and the values are the error messages.
 */
const validateAllowlist = (data: AllowlistEntry[], units: bigint): ValidationResult => {
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

  const filteredAddresses = data.filter((entry) => !isAddress(entry.address.toLowerCase()));
  if (filteredAddresses.length > 0) {
    errors["address"] = filteredAddresses.map((entry) => entry.address);
  }

  if (Object.keys(errors).length > 0) {
    return { data: data as unknown, valid: Object.keys(errors).length === 0, errors };
  }

  return { data: data as AllowlistEntry[], valid: Object.keys(errors).length === 0, errors };
};

/**
 * Verifies a Merkle proof for a given root, signer address, units, and proof.
 *
 * This function first checks if the signer address is a valid Ethereum address. If it's not, it throws a `MintingError`.
 * It then verifies the Merkle proof using the `StandardMerkleTree.verify` method. If the verification fails, it throws a `MintingError`.
 *
 * @param {string} root - The root of the Merkle tree.
 * @param {string} signerAddress - The signer's Ethereum address.
 * @param {bigint} units - The number of units.
 * @param {string[]} proof - The Merkle proof to verify.
 * @throws {MintingError} Will throw a `MintingError` if the signer address is invalid or if the Merkle proof verification fails.
 */
function verifyMerkleProof(root: string, signerAddress: string, units: bigint, proof: string[]): void {
  if (!isAddress(signerAddress.toLowerCase())) {
    throw new MintingError("Invalid address", { signerAddress });
  }

  const verified = StandardMerkleTree.verify(root, ["address", "uint256"], [signerAddress, units], proof);
  if (!verified) {
    throw new MintingError("Merkle proof verification failed", { root, proof });
  }
}

/**
 * Verifies multiple Merkle proofs for given roots, a signer address, units, and proofs.
 *
 * This function first checks if the lengths of the roots, units, and proofs arrays are equal. If they're not, it throws a `MintingError`.
 * It then iterates over the arrays and verifies each Merkle proof using the `verifyMerkleProof` function. If any verification fails, it throws a `MintingError`.
 *
 * @param {string[]} roots - The roots of the Merkle trees.
 * @param {string} signerAddress - The signer's Ethereum address.
 * @param {bigint[]} units - The numbers of units.
 * @param {string[][]} proofs - The Merkle proofs to verify.
 * @throws {MintingError} Will throw a `MintingError` if the lengths of the input arrays are not equal or if any Merkle proof verification fails.
 */
function verifyMerkleProofs(roots: string[], signerAddress: string, units: bigint[], proofs: string[][]) {
  if (roots.length !== units.length || units.length !== proofs.length) {
    throw new MintingError("Invalid input", { roots, units, proofs });
  }

  for (let i = 0; i < roots.length; i++) {
    verifyMerkleProof(roots[i], signerAddress, units[i], proofs[i]);
  }
}

export { validateMetaData, validateClaimData, validateAllowlist, verifyMerkleProof, verifyMerkleProofs };
