import { assertNever } from "./common";
import { InvalidDataError, OutOfBoundsError } from "./errors";
import { AllowlistEntry } from "@hypercerts-org/sdk";
import _ from "lodash";
import Papa from "papaparse";

/**
 * Takes a CSV and creates an allowlist
 * @param csv - Original CSV file. Must include a header with 'address' and 'fractions'
 * @param add - Manually add more entries with a given percentage (0.0 <= percentage < 1.0)
 * @returns the allowlist
 */
export function parseAllowlistCsv(
  csv: string,
  deduplicate: boolean,
  add: {
    address: string;
    percentage: number;
  }[] = [],
): AllowlistEntry[] {
  // Parse CSV
  const { data: rawData, errors } = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });
  if (errors.length > 0) {
    console.error("Errors parsing allowlist:", errors);
    throw new InvalidDataError("Errors parsing allowlist");
  }
  // Get the addresses and units from the CSV
  const csvData = rawData.map((row: any) => ({
    address: row["address"].trim().toLowerCase(),
    units: parseInt(row["fractions"].trim(), 10),
  }));
  const csvTotalSupply = csvData.reduce((accum, curr) => accum + curr.units, 0);
  if (csvTotalSupply <= 0) {
    throw new InvalidDataError("Did not find any valid rows");
  }
  // Calculate the new total supply
  const addTotalPercentage = add.reduce(
    (accum, curr) => accum + curr.percentage,
    0.0,
  );
  if (addTotalPercentage < 0.0 || addTotalPercentage >= 1.0) {
    throw new OutOfBoundsError(
      "Total percentage added must be between [0.0, 1.0]",
    );
  }
  for (let i = 0; i < add.length; i++) {
    if (add[i].percentage < 0.0 || add[i].percentage >= 1.0) {
      throw new OutOfBoundsError("Percentage added must be between [0.0, 1.0]");
    }
  }
  // Combine CSV data with manually added addresses
  const csvTotalPercentage = 1.0 - addTotalPercentage;
  const totalSupply = csvTotalSupply / csvTotalPercentage;
  const data = csvData.concat(
    add.map((x) => ({
      address: x.address.trim().toLowerCase(),
      units: Math.floor(totalSupply * x.percentage),
    })),
  );

  // Return if no deduplication
  if (!deduplicate) {
    return data;
  }

  // Deduplicate
  const groups = _.groupBy(data, (x) => x.address);
  const addressToUnits = _.mapValues(groups, (x) =>
    x.reduce((accum, curr) => accum + curr.units, 0),
  );

  const result = _.toPairs(addressToUnits).map(([address, units]) => ({
    address,
    units,
  }));
  return result;
}

/**
 * Takes a string and splits into a list of strings
 * - Currently only works on ',' and new lines
 * @param input
 * @param opts.lowercase "all" if lowercase everything, "addresses" if only valid addresses
 * @param opts.deduplicate remove duplicate items. This happens after lowercasing.
 * @returns
 */
export const parseListFromString = (
  input: string,
  opts?: {
    lowercase?: "all" | "addresses";
    deduplicate?: boolean;
  },
) => {
  let list = input
    // Split on either new lines or commas
    .split(/[,\n]/)
    // Cleanup
    .map((i) => i.trim())
    // Filter out non-truthy values
    .filter((i) => !!i);
  if (opts?.lowercase) {
    switch (opts.lowercase) {
      case "all":
        list = list.map((x) => x.toLowerCase());
        break;
      case "addresses":
        list = list.map((x) =>
          x.match(/^0x[a-fA-F0-9]{40}$/) ? x.toLowerCase() : x,
        );
        break;
      default:
        assertNever(opts.lowercase);
    }
  }
  if (opts?.deduplicate) {
    list = _.uniq(list);
  }
  return list;
};
