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
  const provider = new ethers.providers.AlchemyProvider(
    network.networkKey,
    ALCHEMY_KEY,
  );

  // Check data availability
  const body = event.request.body;
  if (!("type" in body) || body.type !== "BLOCK") {
    throw new NotImplementedError("Event body is not a BlockTriggerEvent");
  }
  const blockTriggerEvent = body as BlockTriggerEvent;
  const contractAddress = blockTriggerEvent.matchedAddresses[0];
  const fromAddress = blockTriggerEvent.transaction.from;
  const txnLogs = blockTriggerEvent.transaction.logs;
  const tx = await provider.getTransaction(blockTriggerEvent.hash);

  if (!contractAddress) {
    throw new MissingDataError(`body.matchedAddresses is missing`);
  } else if (!fromAddress) {
    throw new MissingDataError(`body.transaction.from is missing`);
  } else if (!txnLogs) {
    throw new MissingDataError(`body.transaction.logs is missing`);
  } else if (!tx) {
    throw new MissingDataError(`tx is missing`);
  }

  console.log("Contract address", contractAddress);
  console.log("From address", fromAddress);

  const contractInterface = new ethers.utils.Interface(abi);

  // Parse events
  const txnEvents = txnLogs.map((l) => contractInterface.parseLog(l));
  const batchTransferEvents = txnEvents.filter((e) => e.name === "LeafClaimed");

  console.log(
    "BatchTransfer Events: ",
    JSON.stringify(batchTransferEvents, null, 2),
  );

  if (batchTransferEvents.length !== 1) {
    throw new MissingDataError(
      `Unexpected saw ${batchTransferEvents.length} BatchTransfer events`,
    );
  }

  // Get claimIDs
  const claimIds = batchTransferEvents[0].args["claimIDs"] as string[];
  console.log("ClaimIDs: ", batchTransferEvents[0].args["claimIDs"].toString());

  const formattedClaimIds = claimIds.map(
    (claimId) => `${contractAddress}-${claimId.toString().toLowerCase()}`,
  );
  console.log("Formatted claim ids", formattedClaimIds);

  // Wait for transaction to be confirmed for 5 blocks
  if (await tx.wait(5).then((receipt) => receipt.status === 1)) {
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
