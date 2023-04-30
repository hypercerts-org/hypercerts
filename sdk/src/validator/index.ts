import Ajv from "ajv";
import { BigNumber, BigNumberish } from "ethers";
import { isAddress } from "ethers/lib/utils.js";

import claimDataSchema from "../resources/schema/claimdata.json";
import metaDataSchema from "../resources/schema/metadata.json";
import { HypercertClaimdata } from "../types/claimdata.js";
import { Allowlist } from "../types/hypercerts.js";
import { HypercertMetadata } from "../types/metadata.js";

const ajv = new Ajv.default({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
ajv.addSchema(metaDataSchema, "metaData");
ajv.addSchema(claimDataSchema, "claimData");

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

const validateAllowlist = (data: Allowlist, units: BigNumberish) => {
  const errors: Record<string, string | string[]> = {};
  const totalUnits = data.reduce((acc, curr) => acc.add(curr.units), BigNumber.from(0));
  if (totalUnits !== units) {
    errors["units"] = "Total units in allowlist must match total units";
  }

  const filteredAddresses = data.filter((entry) => !isAddress(entry.address));
  if (filteredAddresses.length > 0) {
    errors["address"] = filteredAddresses.map((entry) => entry.address);
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export { validateMetaData, validateClaimData, validateAllowlist };
