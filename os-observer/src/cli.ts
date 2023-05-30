#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { handleError } from "./utils/error.js";
import { EventSourceFunction } from "./utils/api.js";
import { GithubCommitsArgs, githubCommits } from "./events/github.js";
import { NpmDownloadsArgs, npmDownloads } from "./events/npm.js";

const callLibrary = async <Args>(
  func: EventSourceFunction<Args>,
  args: Args,
): Promise<void> => {
  // TODO: handle ApiReturnType properly and generically here
  const result = await func(args);
  console.log(result);
};

yargs(hideBin(process.argv))
  .command<GithubCommitsArgs>(
    "githubCommits",
    "Fetch GitHub commits",
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
    (argv) => handleError(callLibrary(githubCommits, argv)),
  )
  .command<NpmDownloadsArgs>(
    "npmDownloads",
    "Fetch NPM downloads",
    (yags) => {
      yags
        .option("name", {
          type: "string",
          describe: "Package name",
        })
        .demandOption(["name"]);
    },
    (argv) => handleError(callLibrary(npmDownloads, argv)),
  )
  .demandCommand()
  .strict()
  .help("h")
  .alias("h", "help")
  .parse();
