import { abi } from "../HypercertMinterABI";
import { MissingDataError, NotImplementedError } from "../errors";
import { getNetworkConfigFromName } from "../networks";
import {
  AutotaskEvent,
  BlockTriggerEvent,
} from "@openzeppelin/defender-autotask-utils";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { createClient } from "@supabase/supabase-js";
import axios from "axios";
import { ethers } from "ethers";
import fetch from "node-fetch";

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

  const provider = new ethers.providers.AlchemyProvider(
    network.networkKey,
    ALCHEMY_KEY,
  );
  const contractInterface = new ethers.utils.Interface(abi);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  //Ignore unknown events
  const allowlistCreatedEvents = txnLogs
    .map((l) => {
      try {
        return contractInterface.parseLog(l);
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

  const tokenId = allowlistCreatedEvents[0].args["tokenID"].toString();
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
  const tree = StandardMerkleTree.load(JSON.parse(treeResponse));

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
  }));
  console.log("data", data);

  const addResult = await client
    .from(network.supabaseTableName)
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
