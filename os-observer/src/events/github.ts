import { EventSourceFunction, ApiReturnType } from "../utils/api.js";

export interface GithubCommitsArgs {
  org: string;
  repo: string;
}

export const githubCommits: EventSourceFunction<GithubCommitsArgs> = async (
  args: GithubCommitsArgs,
): Promise<ApiReturnType> => {
  console.log(args);
  return {
    _type: "upToDate",
    cached: true,
  };
};
