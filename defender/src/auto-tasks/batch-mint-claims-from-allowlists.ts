import { ethers } from "ethers";
import { AutotaskEvent, SentinelTriggerEvent } from "defender-autotask-utils";

import { createClient } from "@supabase/supabase-js";
import { HypercertMinterABI } from "@hypercerts-org/hypercerts-protocol";
import fetch from "node-fetch";

export async function handler(event: AutotaskEvent) {
  const { SUPABASE_URL, SUPABASE_SECRET_API_KEY } = event.secrets;

  const client = createClient(SUPABASE_URL, SUPABASE_SECRET_API_KEY, {
    global: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fetch: (...args) => fetch(...args),
    },
  });

  console.log("Event", event);
  const match = event.request.body as SentinelTriggerEvent;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fromAddress = match.transaction.from;
  console.log("From address", fromAddress);

  const tx = await ethers
    .getDefaultProvider("goerli")
    .getTransaction(match.hash);

  const contractInterface = new ethers.utils.Interface(HypercertMinterABI);
  const decodedData = contractInterface.parseTransaction({
    data: tx.data,
    value: tx.value,
  });

  const claimIds = decodedData.args["claimIDs"] as string[];
  console.log("claimIds", claimIds);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const contractAddress = match.matchedAddresses[0];
  const formattedClaimIds = claimIds.map(
    (claimId) => `${contractAddress}-${claimId.toString().toLowerCase()}`,
  );
  console.log("Formatted claim ids", formattedClaimIds);

  const deleteResult = await client
    .from("allowlistCache")
    .delete()
    .eq("address", fromAddress)
    .in("claimId", formattedClaimIds)
    .select();

  console.log("delete result", deleteResult);
}
