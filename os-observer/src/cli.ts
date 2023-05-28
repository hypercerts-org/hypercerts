#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { handleError } from "./utils/error.js";
import { FetchGithubArgs, fetchGithub } from "./actions/fetch-github.js";

export interface CommonArgs {
  yes?: boolean;
}

yargs(hideBin(process.argv))
  .option("yes", {
    type: "boolean",
    describe: "Automatic yes to all prompts",
    default: false,
  })
  .command<FetchGithubArgs>(
    "fetch-github",
    "Fetch GitHub data",
    (yags) => {
      yags.option("repo", {
        type: "string",
        describe: "GitHub repo URL",
      });
    },
    (argv) => handleError(fetchGithub(argv)),
  )
  .demandCommand()
  .strict()
  .help("h")
  .alias("h", "help")
  .parse();
