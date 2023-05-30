#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { handleError } from "./utils/error.js";
import {
  FetchGithubArgs,
  fetchGithub,
} from "./actions/fetch-github/fetch-github.js";

export interface CommonArgs {
  yes?: boolean;
}

yargs(hideBin(process.argv))
  .option("yes", {
    type: "boolean",
    describe: "Automatic yes to all prompts",
    default: false,
  })
  .command("fetch-github", "Fetch GitHub data", (yags) => {
    return yags.command<FetchGithubArgs>(
      "repo",
      "github repo",
      (yargs) => {
        return yargs
          .option("owner", {
            type: "string",
            describe: "repo owner",
          })
          .option("name", {
            type: "string",
            describe: "repo name",
          });
      },
      (argv) => handleError(fetchGithub(argv)),
    );
  })
  .demandCommand()
  .strict()
  .help("h")
  .alias("h", "help")
  .parse();
