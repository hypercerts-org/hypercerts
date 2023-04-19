import Ajv from "ajv";
import Result, { err, ok } from "true-myth/result";

import { HypercertsSdkError, MalformedDataError, UnknownSchemaError } from "../errors.js";
import claimData from "../resources/schema/claimdata.json" assert { type: "json" };
import metaData from "../resources/schema/metadata.json" assert { type: "json" };
import { HypercertClaimdata } from "../types/claimdata.js";
import { HypercertMetadata } from "../types/metadata.js";

const ajv = new Ajv.default({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
ajv.addSchema(metaData, "metaData");
ajv.addSchema(claimData, "claimData");

const validateMetaData = (data: HypercertMetadata): Result<boolean, HypercertsSdkError> => {
  const schemaName = "metaData";
  const validate = ajv.getSchema<HypercertMetadata>(schemaName);
  if (!validate) {
    return err(new UnknownSchemaError("Schema not found", { schemaName }));
  }

  if (!validate(data)) {
    const errors: Record<string, string> = {};
    for (const e of validate.errors || []) {
      const key = e.params.missingProperty || "other";
      if (key && e.message) {
        errors[key] = e.message;
      }
    }
    return err(new MalformedDataError("Metadata validation failed", errors));
  }

  return ok(true);
};

const validateClaimData = (data: HypercertClaimdata): Result<boolean, HypercertsSdkError> => {
  const schemaName = "claimData";
  const validate = ajv.getSchema<HypercertClaimdata>(schemaName);
  if (!validate) {
    return err(new UnknownSchemaError("Schema not found", { schemaName }));
  }

  if (!validate(data)) {
    const errors: Record<string, string> = {};
    for (const e of validate.errors || []) {
      const key = e.params.missingProperty || "other";
      if (key && e.message) {
        errors[key] = e.message;
      }
    }
    return err(new MalformedDataError("Claimdata validation failed", errors));
  }

  return ok(true);
};

export { validateMetaData, validateClaimData };
