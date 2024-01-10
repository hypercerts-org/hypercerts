import {
  AutotaskEvent,
  BlockTriggerEvent,
} from "@openzeppelin/defender-autotask-utils";
import { getNetworkConfigFromName } from "../networks";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import { BigNumber, ethers } from "ethers";
import { MissingDataError, NotImplementedError } from "../errors";
import {
  HypercertExchangeAbi,
  HypercertMinterAbi,
} from "@hypercerts-org/contracts";

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

  let provider;

  if (ALCHEMY_KEY) {
    provider = new ethers.providers.AlchemyProvider(
      network.networkKey,
      ALCHEMY_KEY,
    );
  } else if (network.rpc) {
    provider = new ethers.providers.JsonRpcProvider(network.rpc);
  } else {
    throw new Error("No provider available");
  }

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

  // TODO: Update contracts so we can use ABI from the @hypercerts-org/contracts package
  const hypercertsMinterContractInterface = new ethers.utils.Interface(
    HypercertMinterAbi,
  );

  // Parse TransferSingle events
  const parsedLogs = txnLogs.map((l) => {
    //Ignore unknown events
    try {
      return hypercertsMinterContractInterface.parseLog(l);
    } catch (e) {
      console.log("Failed to parse log", l);
      return null;
    }
  });
  console.log("Parsed logs: ", JSON.stringify(parsedLogs, null, 2));
  const transferSingleEvents = parsedLogs.filter(
    (e) => e !== null && e.name === "TransferSingle",
  );

  console.log(
    "TransferSingle Events: ",
    JSON.stringify(transferSingleEvents, null, 2),
  );

  if (transferSingleEvents.length !== 1) {
    throw new MissingDataError(
      `Unexpected saw ${transferSingleEvents.length} TransferSingle events`,
    );
  }

  // Get claimID
  const signerAddress = transferSingleEvents[0].args["from"] as string;
  const itemId = BigNumber.from(transferSingleEvents[0].args["id"]).toString();

  const hypercertExchangeContractInterface = new ethers.utils.Interface(
    HypercertExchangeAbi,
  );
  // Parse TakerBid events
  const takerBidEvents = txnLogs
    .map((l) => {
      //Ignore unknown events
      try {
        return hypercertExchangeContractInterface.parseLog(l);
      } catch (e) {
        console.log("Failed to parse log", l);
        return null;
      }
    })
    .filter((e) => e !== null && e.name === "TakerBid");

  console.log("TakerBid Events: ", JSON.stringify(takerBidEvents, null, 2));

  if (takerBidEvents.length !== 1) {
    throw new MissingDataError(
      `Unexpected saw ${takerBidEvents.length} TakerBid events`,
    );
  }

  // Get claimID
  const orderNonce = BigNumber.from(
    takerBidEvents[0].args["nonceInvalidationParameters"][1],
  ).toString();
  console.log(
    "Signer Address: ",
    signerAddress,
    "Order nonce: ",
    orderNonce,
    "Fraction ID: ",
    itemId,
    "Chain ID: ",
    network.chainId,
  );

  // Remove from DB
  if (await tx.wait(5).then((receipt) => receipt.status === 1)) {
    const deleteResult = await client
      .from("marketplace-orders")
      .delete()
      .eq("signer", signerAddress)
      .eq("chainId", network.chainId)
      .eq("orderNonce", orderNonce)
      .containedBy("itemIds", [itemId])
      .select()
      .throwOnError();
    console.log("Deleted", deleteResult);

    if (!deleteResult) {
      throw new Error(
        `Could not remove from database. Delete result: ${JSON.stringify(
          deleteResult,
        )}`,
      );
    }
  }
}
