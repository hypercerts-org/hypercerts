import npmFetch from "npm-registry-fetch";
import { EventSourceFunction, ApiReturnType } from "../utils/api.js";
import { logger } from "../utils/logger.js";
import { parseGithubUrl } from "../utils/parsing.js";

export interface NpmDownloadsArgs {
  name: string;
}

/**
 * Get all of the daily downloads for a package
 * TODO: refactor out the idempotent parts of this into utility functions
 * @param args
 */
export const npmDownloads: EventSourceFunction<NpmDownloadsArgs> = async (
  args: NpmDownloadsArgs,
): Promise<ApiReturnType> => {
  const { name } = args;
  logger.info(`NPM Downloads: fetching for ${name}`);

  // Get package.json
  const pkgManifest: any = await npmFetch.json(`/${name}/latest`);
  //console.log(JSON.stringify(pkgManifest, null, 2));

  // Check if the artifact exists

  // Check if the organization exists
  const repoUrl = pkgManifest?.repository?.url ?? "";
  const { owner: githubOrg } = parseGithubUrl(repoUrl) ?? {};
  if (!githubOrg) {
    logger.warn(`Unable to find the GitHub organization for ${name}`);
  }
  console.log(githubOrg);

  // Get the latest event source pointer

  // Retrieve any missing data

  // Populate the database

  // Return results

  return {
    _type: "upToDate",
    cached: true,
  };
};
