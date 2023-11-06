import { HypercertClaimdata, HypercertMetadata } from "../types";
import { validateClaimData, validateMetaData } from "../validator";

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

type FormatResult = { data: HypercertMetadata | null; valid: boolean; errors: Record<string, string> | null };

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
  external_url?: string;
  image: string;
  version: string;
  properties?: { trait_type: string; value: string }[];
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
}): FormatResult => {
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

  const { valid: claimDataValid, errors: claimDataErrors } = validateClaimData(claimData);
  if (!claimDataValid) {
    return { valid: false, errors: claimDataErrors, data: null } as FormatResult;
  }

  const metaData: HypercertMetadata = {
    name,
    description,
    image,
    version,
    hypercert: claimData,
  };

  if (properties && properties.length > 0) {
    metaData.properties = properties;
  }

  if (external_url && external_url.length > 0) {
    metaData.external_url = external_url;
  }

  const { valid: metaDataValid, errors: metaDataErrors } = validateMetaData(metaData);
  if (!metaDataValid) {
    return { valid: false, errors: metaDataErrors, data: null } as FormatResult;
  }

  return { data: metaData, valid: true, errors: null };
};

export { formatDate, formatUnixTime, formatHypercertData };
