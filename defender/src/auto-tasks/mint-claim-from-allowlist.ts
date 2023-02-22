import { ethers } from "ethers";
import { AutotaskEvent, SentinelTriggerEvent } from "defender-autotask-utils";
import { createClient } from "@supabase/supabase-js";
import * as protocol from "@hypercerts-org/hypercerts-protocol";
const { HypercertMinterABI } = protocol;
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

  const match = event.request.body as SentinelTriggerEvent;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const tokenId = match.matchReasons[0].params.tokenID as string;
  console.log("TokenId", tokenId);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fromAddress = match.transaction.from;
  console.log("From address", fromAddress);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const contractAddress = match.matchedAddresses[0];

  const tx = await ethers
    .getDefaultProvider("goerli")
    .getTransaction(match.hash);

  const contractInterface = new ethers.utils.Interface(HypercertMinterABI);
  const decodedData = contractInterface.parseTransaction({
    data: tx.data,
    value: tx.value,
  });

  const claimId = decodedData.args["claimID"] as string;
  const formattedClaimId = `${contractAddress}-${claimId
    .toString()
    .toLowerCase()}`;

  const deleteResult = await client
    .from("allowlistCache")
    .delete()
    .eq("address", fromAddress)
    .eq("claimId", formattedClaimId)
    .select();
  console.log("Deleted", deleteResult);
}
