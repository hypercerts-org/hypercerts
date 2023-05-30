import { CommonArgs } from "../../cli.js";
import { fetchGithubRepo } from "../../github.js";
import { getRepoId } from "./getRepoId.js";

export interface FetchGithubArgs extends CommonArgs {
  name: string;
  owner?: string;
}

export async function fetchGithub(args: FetchGithubArgs) {
  if (args.owner) {
    getRepoId({
      type: "githubRepo",
      name: args.name,
      owner: args.owner,
    });
  }

  console.log(args);
}
