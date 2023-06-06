import { ethers } from "ethers";
import { AutotaskEvent, BlockTriggerEvent } from "defender-autotask-utils";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { getNetworkConfigFromName } from "../networks";
import { MissingDataError, NotImplementedError } from "../errors";
import { abi } from "../HypercertMinterABI";

export async function handler(event: AutotaskEvent) {
  console.log(
    "Event: ",
    JSON.stringify(
      { ...event, secrets: "HIDDEN", credentials: "HIDDEN" },
      null,
      2,
    ),
  );
  const network = getNetworkConfigFromName(event.autotaskName);
  const { SUPABASE_URL, SUPABASE_SECRET_API_KEY } = event.secrets;
  const ALCHEMY_KEY = event.secrets[network.alchemyKeyEnvName];
  const client = createClient(SUPABASE_URL, SUPABASE_SECRET_API_KEY, {
    global: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fetch: (...args) => fetch(...args),
    },
  });
  const body = event.request.body;
  if (!("type" in body) || body.type !== "BLOCK") {
    throw new NotImplementedError("Event body is not a BlockTriggerEvent");
  }
  const blockTriggerEvent = body as BlockTriggerEvent;
  const contractAddress = blockTriggerEvent.matchedAddresses[0];
  const fromAddress = blockTriggerEvent.transaction.from;
  if (!contractAddress) {
    throw new MissingDataError(`body.matchedAddresses is missing`);
  } else if (!fromAddress) {
    throw new MissingDataError(`body.transaction.from is missing`);
  }
  console.log("Contract address", contractAddress);
  console.log("From address", fromAddress);

  const provider = new ethers.providers.AlchemyProvider(
    network.networkKey,
    ALCHEMY_KEY,
  );
  const tx = await provider.getTransaction(blockTriggerEvent.hash);
  const contractInterface = new ethers.utils.Interface(abi);
  const decodedData = contractInterface.parseTransaction({
    data: tx.data,
    value: tx.value,
  });

  console.log("Transaction: ", JSON.stringify(decodedData, null, 2));
  const claimIds = decodedData.args["claimIDs"] as string[];
  console.log("claimIds", claimIds);
  const formattedClaimIds = claimIds.map(
    (claimId) => `${contractAddress}-${claimId.toString().toLowerCase()}`,
  );
  console.log("Formatted claim ids", formattedClaimIds);

  if (tx.wait(10)) {
    console.log("Transaction confirmed");
    const deleteResult = await client
      .from(network.supabaseTableName)
      .delete()
      .eq("address", fromAddress)
      .in("claimId", formattedClaimIds)
      .select();

    console.log("delete result", deleteResult);
  }
}
