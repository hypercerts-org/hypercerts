import axios from "axios";
import { AutotaskEvent, BlockTriggerEvent } from "defender-autotask-utils";
import { ethers } from "ethers";
import fetch from "node-fetch";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { createClient } from "@supabase/supabase-js";
import { getNetworkConfigFromName } from "../networks";
import { MissingDataError, NotImplementedError } from "../errors";
import { abi } from "../HypercertMinterABI";

const getIpfsGatewayUri = (cidOrIpfsUri: string) => {
  const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
  const cid = cidOrIpfsUri.replace("ipfs://", "");
  return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cid);
};

export const getData = async (cid: string) => {
  const nftStorageGatewayLink = getIpfsGatewayUri(cid);
  console.log(`Getting metadata ${cid} at ${nftStorageGatewayLink}`);
  return axios.get(nftStorageGatewayLink).then((result) => result.data);
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
  const metadataUri = decodedData.args["_uri"];
  console.log("MetadataUri", metadataUri);
  const metadata = await getData(metadataUri);
  console.log("Metadata", { ...metadata, image: metadata.image?.slice(0, 64) });
  if (!metadata?.allowList) {
    throw new Error(`No allowlist found`);
  }

  const txnEvents = txnLogs.map((l) => contractInterface.parseLog(l));
  const allowlistCreatedEvents = txnEvents.filter(
    (e) => e.name === "AllowlistCreated",
  );
  console.log(
    "AllowlistCreated Events: ",
    JSON.stringify(allowlistCreatedEvents, null, 2),
  );
  if (allowlistCreatedEvents.length !== 1) {
    throw new MissingDataError(
      `Unexpected saw ${allowlistCreatedEvents.length} AllowlistCreated events`,
    );
  }
  const tokenId = allowlistCreatedEvents[0].args["tokenID"].toString();
  console.log("TokenId: ", tokenId);

  // Get allowlist
  const treeResponse = await getData(metadata.allowList);
  if (!treeResponse) {
    throw new Error("Could not fetch json tree dump for allowlist");
  }
  const tree = StandardMerkleTree.load(JSON.parse(treeResponse));

  // Find the proof
  const addresses: string[] = [];
  for (const [, v] of tree.entries()) {
    addresses.push(v[0]);
  }
  console.log("addresses", addresses);
  const pairs = addresses.map((address) => ({
    address: address.toLowerCase(),
    claimId: `${contractAddress}-${tokenId}`,
  }));
  console.log("pairs", pairs);

  const addResult = await client
    .from(network.supabaseTableName)
    .insert(pairs)
    .select()
    .then((data) => data.data);

  console.log("add result", addResult);
}
