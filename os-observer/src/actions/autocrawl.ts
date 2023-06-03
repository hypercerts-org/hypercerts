import { prisma } from "../db/prisma-client.js";
import { ApiReturnType, CommonArgs } from "../utils/api.js";
import { normalizeToObject } from "../utils/common.js";
import { logger } from "../utils/logger.js";
import { FETCHER_REGISTRY } from "../cli.js";

/**
 * Entrypoint arguments
 */
export type RunAutocrawlArgs = CommonArgs;

export async function runAutocrawl(_args: RunAutocrawlArgs): Promise<void> {
  // Get all pointers marked for autocrawl
  const pointers = await prisma.eventSourcePointer.findMany({
    where: {
      autocrawl: true,
    },
  });

  // Iterate over pointers and call the appropriate function
  const summarize = async (
    queryCommand: string,
    queryArgs: any,
    p: Promise<ApiReturnType>,
  ) => {
    const result = await p;
    return {
      queryCommand,
      queryArgs,
      ...result,
    };
  };
  const promises = pointers.map(async (evtSrcPtr) => {
    const { queryCommand, queryArgs } = evtSrcPtr;
    logger.info(
      `Running autocrawl for ${queryCommand} with args ${JSON.stringify(
        queryArgs,
      )}`,
    );
    const action = FETCHER_REGISTRY.find((f) => f.command === queryCommand);
    if (!action) {
      logger.warn(`Unknown queryCommand: ${queryCommand}`);
      return;
    }
    return summarize(
      queryCommand,
      queryArgs,
      action.func(normalizeToObject(queryArgs)),
    );
  });

  // Go do it
  console.log(await Promise.all(promises));
}
