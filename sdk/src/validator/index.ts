import Ajv from "ajv";

import claimData from "../resources/schema/claimdata.json" assert { type: "json" };
import metaData from "../resources/schema/metadata.json" assert { type: "json" };
import { HypercertClaimdata } from "../types/claimdata.js";
import { HypercertMetadata } from "../types/metadata.js";

const ajv = new Ajv.default({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
ajv.addSchema(metaData, "metaData");
ajv.addSchema(claimData, "claimData");

type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

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

export { validateMetaData, validateClaimData };
