#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { RunAutocrawlArgs, runAutocrawl } from "./actions/autocrawl.js";
import { handleError } from "./utils/error.js";
import { EventSourceFunction } from "./utils/api.js";
import { NpmDownloadsArgs, NpmDownloadsInterface } from "./events/npm.js";
import {
  GithubFetchArgs,
  GithubIssueFiledInterface,
} from "./actions/github/fetch/issueFiled.js";
import {
  UpsertGithubOrgInterface,
  UpsertGithubOrgArgs,
} from "./actions/github/upsertOrg/index.js";

const callLibrary = async <Args>(
  func: EventSourceFunction<Args>,
  args: Args,
): Promise<void> => {
  // TODO: handle ApiReturnType properly and generically here
  const result = await func(args);
  console.log(result);
};

/**
 * When adding a new fetcher, please remember to add it to both this registry and yargs
 */
export const FETCHER_REGISTRY = [
  GithubIssueFiledInterface,
  NpmDownloadsInterface,
];
yargs(hideBin(process.argv))
  .option("yes", {
    type: "boolean",
    describe: "Automatic yes to all prompts",
    default: false,
  })
  .option("autocrawl", {
    type: "boolean",
    describe: "Mark the query for auto-crawling",
    default: false,
  })
  .command<RunAutocrawlArgs>(
    "runAutocrawl",
    "Iterate over EventSourcePointer table and update all data marked for autocrawl",
    (yags) => {
      yags;
    },
    (argv) => handleError(runAutocrawl(argv)),
  )
  .command<UpsertGithubOrgArgs>(
    UpsertGithubOrgInterface.command,
    "Add or update a github organization",
    (yags) => {
      yags
        .option("githubOrg", {
          type: "string",
          describe: "GitHub organization name",
        })
        .option("name", {
          type: "string",
          describe: "GitHub organization name",
        })
        .demandOption(["githubOrg", "name"]);
    },
    (argv) => handleError(callLibrary(UpsertGithubOrgInterface.func, argv)),
  )
  .command<GithubFetchArgs>(
    GithubIssueFiledInterface.command,
    "Fetch GitHub Issues Filed",
    (yags) => {
      yags
        .option("org", {
          type: "string",
          describe: "GitHub organization name",
        })
        .option("repo", {
          type: "string",
          describe: "GitHub repository name",
        })
        .demandOption(["org", "repo"]);
    },
    (argv) => handleError(callLibrary(GithubIssueFiledInterface.func, argv)),
  )
  .command<NpmDownloadsArgs>(
    NpmDownloadsInterface.command,
    "Fetch NPM downloads",
    (yags) => {
      yags
        .option("name", {
          type: "string",
          describe: "Package name",
        })
        .demandOption(["name"]);
    },
    (argv) => handleError(callLibrary(NpmDownloadsInterface.func, argv)),
  )
  .demandCommand()
  .strict()
  .help("h")
  .alias("h", "help")
  .parse();
