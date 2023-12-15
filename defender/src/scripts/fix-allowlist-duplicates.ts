// const supabaseLib = require("@supabase/supabase-js");
// const dotenv = require("dotenv");
// const _ = require("lodash");
// import * as fetch from "node-fetch";
// const hypercertsSDK = require("@hypercerts-org/hypercerts-sdk");

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import _ from "lodash";
import fetch from "node-fetch";

const pageSize = 1000;

dotenv.config();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_HYPERCERTS_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY as string,
);

const fetchAllowlistPage = async (lastId: number) => {
  console.log("fetching page with id >", lastId);
  return supabase
    .from("allowlistCache-chainId")
    .select("*")
    .order("id", { ascending: true })
    .gt("id", lastId)
    .eq("chainId", 10)
    .limit(pageSize);
};

const deleteEntries = async (ids: number[]) => {
  console.log("deleting entries", ids);
  return supabase.from("allowlistCache-chainId").delete().in("id", ids);
};

const query = `
query ClaimTokensByClaim($claimId: String!, $orderDirection: OrderDirection, $first: Int, $skip: Int) {
  claimTokens(where: { claim: $claimId }, skip: $skip, first: $first, orderDirection: $orderDirection) {
    id
    owner
    tokenID
    units
  }
}
`;

const fetchClaimTokenForClaimId = async (claimId: string) => {
  return (
    fetch(
      "https://api.thegraph.com/subgraphs/name/hypercerts-admin/hypercerts-optimism-mainnet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variables: {
            claimId,
            first: 1000,
          },
          query,
        }),
      },
    )
      .then((res) => res.json())
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .then((res) => res.data?.claimTokens)
  );
};

const main = async () => {
  const totalNumberOfResults = await supabase
    .from("allowlistCache-chainId")
    .select("id", { count: "exact" });

  console.log("totalNumberOfResults", totalNumberOfResults.count);

  let lastId = 1;

  // Iterate over all pages
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data } = await fetchAllowlistPage(lastId);
    if (data.length === 0) {
      break;
    }
    lastId = data[data.length - 1].id;

    const allowlistEntriesByClaimId = _.groupBy(data, "claimId");
    // console.log("fetched page", i);

    for (const claimId in allowlistEntriesByClaimId) {
      // console.log("checking duplicates for", claimId);
      const entries = allowlistEntriesByClaimId[claimId];
      // console.log(entries.length, "entries found");

      const tokensForClaim = await fetchClaimTokenForClaimId(claimId);
      // console.log("tokensForClaim", tokensForClaim);

      const addressesForClaimTokens = tokensForClaim.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (token: any) => token.owner,
      );
      const addressesForEntry = entries.map((x) => x.address);
      // console.log("Addresses for claim tokens", addressesForClaimTokens);
      // console.log("Addresses for entries", addressesForEntry);

      const duplicates = _.intersectionBy(
        addressesForClaimTokens,
        addressesForEntry,
      );

      if (duplicates.length > 0) {
        const supabaseEntries = entries.filter((entry) =>
          duplicates.includes(entry.address),
        );
        // console.log("duplicates found for claimId", claimId, duplicates.length);
        // console.log("duplicates", duplicates);
        // console.log("duplicate supabaseEntries", supabaseEntries);
        const idsToDelete = supabaseEntries.map((x) => x.id);
        await deleteEntries(idsToDelete);
      }
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
