import { MissingDataError, NotImplementedError } from "../errors";
import {
  AutotaskEvent,
  BlockTriggerEvent,
} from "@openzeppelin/defender-autotask-utils";
import {
  getNetworkConfigFromName,
  SUPABASE_ALLOWLIST_TABLE_NAME,
} from "../networks";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import fetch from "node-fetch";
import axios from "axios";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

const getIpfsGatewayUri = (cidOrIpfsUri: string) => {
  const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
  const cid = cidOrIpfsUri.replace("ipfs://", "");
  return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cid);
};

export const getData = async (cidOrIpfsUri: string) => {
  const ipfsGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);
  console.log(`Getting metadata ${cidOrIpfsUri} at ${ipfsGatewayLink}`);
  return axios.get(ipfsGatewayLink).then((result) => result.data);
};

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
  const txnLogs = blockTriggerEvent.transaction.logs;
  if (!contractAddress) {
    throw new MissingDataError(`body.matchedAddresses is missing`);
  } else if (!txnLogs) {
    throw new MissingDataError(`body.transaction.logs is missing`);
  }
  console.log("Contract address", contractAddress);

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

  const contract = new ethers.Contract(
    contractAddress,
    HypercertMinterAbi,
    provider,
  );

  //Ignore unknown events
  const allowlistCreatedEvents = txnLogs
    .map((l) => {
      try {
        return contract.interface.parseLog(l);
      } catch (e) {
        console.log("Failed to parse log", l);
        return null;
      }
    })
    .filter((e) => e !== null && e.name === "AllowlistCreated");

  console.log(
    "AllowlistCreated Events: ",
    JSON.stringify(allowlistCreatedEvents, null, 2),
  );

  if (allowlistCreatedEvents.length !== 1) {
    throw new MissingDataError(
      `Unexpected saw ${allowlistCreatedEvents.length} AllowlistCreated events`,
    );
  }

  const tokenId = allowlistCreatedEvents[0].args[0].toString();
  console.log("TokenId: ", tokenId);

  const metadataUri = await contract.functions.uri(tokenId);
  console.log("metadataUri: ", metadataUri);

  const metadata = await getData(metadataUri[0]);
  if (!metadata?.allowList) {
    throw new Error(`No allowlist found`);
  }

  console.log("allowlist: ", metadata.allowList);

  // Get allowlist
  const treeResponse = await getData(metadata.allowList);
  if (!treeResponse) {
    throw new Error("Could not fetch json tree dump for allowlist");
  }
  const tree =
    typeof treeResponse === "string"
      ? StandardMerkleTree.load(JSON.parse(treeResponse))
      : StandardMerkleTree.load(treeResponse);

  // Find the proof
  const addresses: string[] = [];
  for (const [, v] of tree.entries()) {
    addresses.push(v[0]);
  }
  console.log("addresses", addresses);
  const data = addresses.map((address, index) => ({
    address: address.toLowerCase(),
    claimId: `${contractAddress}-${tokenId}`,
    fractionCounter: index,
    chainId: network.chainId,
  }));
  console.log("data", data);

  const addResult = await client
    .from(SUPABASE_ALLOWLIST_TABLE_NAME)
    .insert(data)
    .select()
    .then((data) => data.data);

  console.log("add result", addResult);

  if (!addResult) {
    throw new Error(
      `Could not add to database. Add result: ${JSON.stringify(addResult)}`,
    );
  }
}
