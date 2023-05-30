import { getOrgRepos } from "./getOrgRepos.js";
import { getRepoIssues } from "./getRepoIusses.js";

export interface GithubIssuesArgs {
  name: string;
  owner?: string;
}

export async function fetchGithubIssues(args: GithubIssuesArgs) {
  if (args.owner) {
    fetchForRepo(args.name, args.owner);
  } else {
    fetchForOrg(args.name);
  }
}

async function fetchForRepo(repoName: string, repoOwner: string) {
  const repoIssues = await getRepoIssues(`${repoOwner}/${repoName}`);
  console.log(repoName, repoIssues.length);
}

async function fetchForOrg(orgName: string) {
  const repoIDs = await getOrgRepos(orgName);

  for (const repoID of repoIDs) {
    const repoIssues = await getRepoIssues(repoID);
    console.log(repoID, repoIssues.length);
  }
}
