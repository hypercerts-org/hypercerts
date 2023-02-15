import _ from "lodash";
import { isAddress } from "ethers/lib/utils";
import { assertNever } from "./common";

export const parseCsv = (csv: string) => {
  const [headersRaw, ...rest] = csv.split("\n");
  const headers = headersRaw.split(",");
  return rest
    .filter((row) => row !== "")
    .map((row) => {
      const values = row.split(",");
      return values.reduce(
        (result, value, currentIndex) => ({
          ...result,
          [headers[currentIndex]]: value,
        }),
        {} as Record<string, string>,
      );
    });
};

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
        list = list.map((x) => (isAddress(x) ? x.toLowerCase() : x));
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
