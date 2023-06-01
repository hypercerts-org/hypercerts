export interface ParseGitHubUrlResult {
  owner: string;
  name: string;
}

/**
 * Parse a GitHub URL into its owner and name
 * @param url
 * @returns null if invalid input, otherwise the results
 */
export function parseGithubUrl(url: any): ParseGitHubUrlResult | null {
  if (typeof url !== "string") {
    return null;
  }

  // eslint-disable-next-line no-useless-escape
  const regex = /\/\/github.com\/([^/]+)\/([^\./]+)/g;
  const matches = regex.exec(url);
  if (!matches || matches.length < 3) {
    return null;
  }

  return {
    owner: matches[1],
    name: matches[2],
  };
}
