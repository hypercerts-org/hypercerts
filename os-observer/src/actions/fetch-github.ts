import { CommonArgs } from "../cli.js";
import { fetchGithubRepo } from "../github.js";

export interface FetchGithubArgs extends CommonArgs {
  repo?: string;
}

export async function fetchGithub(args: FetchGithubArgs) {
  console.log(args);
  console.log(fetchGithubRepo());
}
