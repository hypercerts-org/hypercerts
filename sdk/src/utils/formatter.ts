import { Result } from "true-myth";
import { err, ok } from "true-myth/result";

import { MalformedDataError } from "../errors.js";
import { HypercertClaimdata } from "../types/claimdata.js";
import { HypercertMetadata } from "../types/metadata.js";
import { validateClaimData, validateMetaData } from "../validator/index.js";
import { handleError } from "./errors.js";

export const INDEFINITE_DATE_STRING = "indefinite";
const formatUnixTime = (seconds: number) => {
  if (seconds == 0) {
    return INDEFINITE_DATE_STRING;
  } else {
    return formatDate(new Date(seconds * 1000));
  }
};

const formatDate = (date: Date) => {
  const fullYear = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${fullYear}-${month}-${day}`;
};

/**
 *
 * Formats input data to an object containing HypercertMetadata including appropriate labels
 * @returns {HypercertMetadata, MalformedDataError}
 */
const formatHypercertData = ({
  name,
  description,
  external_url,
  image,
  version,
  properties,
  impactScope,
  excludedImpactScope = [],
  workScope,
  excludedWorkScope = [],
  workTimeframeStart,
  workTimeframeEnd,
  impactTimeframeStart,
  impactTimeframeEnd,
  contributors,
  rights,
  excludedRights,
}: {
  name: string;
  description: string;
  external_url: string;
  image: string;
  version: string;
  properties: { trait_type: string; value: string }[];
  impactScope: string[];
  excludedImpactScope: string[];
  workScope: string[];
  excludedWorkScope: string[];
  workTimeframeStart: number;
  workTimeframeEnd: number;
  impactTimeframeStart: number;
  impactTimeframeEnd: number;
  contributors: string[];
  rights: string[];
  excludedRights: string[];
}): Result<HypercertMetadata, MalformedDataError> => {
  const claimData: HypercertClaimdata = {
    impact_scope: {
      name: "Impact Scope",
      value: impactScope,
      excludes: excludedImpactScope,
      display_value: impactScope.join(", "),
    },
    work_scope: {
      name: "Work Scope",
      value: workScope,
      excludes: excludedWorkScope,
      display_value: workScope.join(", "),
    },
    impact_timeframe: {
      name: "Impact Timeframe",
      value: [impactTimeframeStart, impactTimeframeEnd],
      display_value: `${formatUnixTime(impactTimeframeStart)} \u2192 ${formatUnixTime(impactTimeframeEnd)}`,
    },
    work_timeframe: {
      name: "Work Timeframe",
      value: [workTimeframeStart, workTimeframeEnd],
      display_value: `${formatUnixTime(workTimeframeStart)} \u2192 ${formatUnixTime(workTimeframeEnd)}`,
    },
    rights: {
      name: "Rights",
      value: rights,
      excludes: excludedRights,
      display_value: rights.join(", "),
    },
    contributors: {
      name: "Contributors",
      value: contributors,
      display_value: contributors.join(", "),
    },
  };

  const claimDataValidation = validateClaimData(claimData);
  if (claimDataValidation.isErr) {
    handleError(claimDataValidation.error);
  }

  const metaData: HypercertMetadata = {
    name,
    description,
    external_url,
    image,
    version,
    properties,
    hypercert: claimData,
  };

  const metaDataValidation = validateMetaData(metaData);
  if (metaDataValidation.isErr) {
    handleError(metaDataValidation.error);
  }
  return metaDataValidation.isOk && claimDataValidation.isOk
    ? ok(metaData)
    : err(
        new MalformedDataError("Could not format data", {
          input: {
            name,
            description,
            external_url,
            image,
            version,
            properties,
            impactScope,
            excludedImpactScope,
            workScope,
            excludedWorkScope,
            workTimeframeStart,
            workTimeframeEnd,
            impactTimeframeStart,
            impactTimeframeEnd,
            contributors,
            rights,
            excludedRights,
          },
        }),
      );
};

export { formatDate, formatUnixTime, formatHypercertData };
