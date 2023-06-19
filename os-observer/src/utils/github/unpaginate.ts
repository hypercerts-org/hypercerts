import { graphQLClient } from "./graphQLClient.js";

import { Path, Choose, getPath } from "../getPath.js";

type PageInfo = {
  hasNextPage: boolean;
  endCursor: string;
};

// TODO: return type should error if not array
// TODO: pageInfoPath should locate a PageInfo object
// type HasPageInfo<T extends Record<string | number, any>, K extends Path<T>> = Choose<T, K> extends PageInfo ? K : never;

// typescript can't infer T because it's not passed in (like in getPath), and K can't be inferred precisely without writing
// out the entire path again. So we curry the function. Sorry for the mess...
export function unpaginate<T extends Record<string | number, any>>() {
  return async function <K extends Path<T>, A extends Path<T>>(
    query: string,
    dataPath: K,
    pageInfoPath: A,
    variables: any = {},
  ): Promise<Choose<T, K> extends Array<any> ? Choose<T, K> : never> {
    let cursor = null;
    const items: any[] = [];

    /* eslint-disable-next-line no-constant-condition */
    while (true) {
      console.log(cursor);
      const data = await graphQLClient.request<T>(query, {
        ...variables,
        cursor: cursor,
      });

      const newItems: any[] = getPath(data, dataPath);
      items.push(...newItems);

      const pageInfo: PageInfo = getPath(data, pageInfoPath);
      if (!pageInfo.hasNextPage) {
        break;
      }

      cursor = pageInfo.endCursor;

      const rateLimit: RateLimit = data.rateLimit;

      if (
        rateLimit.remaining == 0 ||
        rateLimit.remaining - rateLimit.cost <= 0
      ) {
        const timeToReset = Date.parse(rateLimit.resetAt) - Date.now() + 1000;
        console.log(`sleeping until rate limet reset for ${timeToReset}ms`);
        await sleep(timeToReset);
      }
    }

    return items as any;
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RateLimit {
  limit: number;
  cost: number;
  remaining: number;
  resetAt: string;
}
