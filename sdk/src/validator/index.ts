import Ajv from "ajv";
import { BigNumber, BigNumberish } from "ethers";
import { isAddress } from "ethers/lib/utils.js";

import claimDataSchema from "../resources/schema/claimdata.json";
import metaDataSchema from "../resources/schema/metadata.json";
import evaluationSchema from "../resources/schema/evaluation.json";
import {
  HypercertClaimdata,
  Allowlist,
  HypercertMetadata,
  DuplicateEvaluation,
  SimpleTextEvaluation,
} from "../types/index.js";

const ajv = new Ajv.default({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
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
const validateAllowlist = (data: Allowlist, units: BigNumberish) => {
  const errors: Record<string, string | string[]> = {};
  const totalUnits = data.reduce((acc, curr) => acc.add(curr.units), BigNumber.from(0));
  if (!totalUnits.eq(units)) {
    errors[
      "units"
    ] = `Total units in allowlist must match total units [expected: ${units}, got: ${totalUnits.toString()}]`;
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

export {
  validateMetaData,
  validateClaimData,
  validateAllowlist,
  validateDuplicateEvaluationData,
  validateSimpleTextEvaluationData,
};
