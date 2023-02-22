import { ethers } from "ethers";
import { AutotaskEvent, SentinelTriggerEvent } from "defender-autotask-utils";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";
import * as protocol from "@hypercerts-org/hypercerts-protocol";
const { HypercertMinterABI } = protocol;
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import axios from "axios";

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const contractAddress = match.matchedAddresses[0];
  console.log("TokenId", tokenId);
  console.log("Contract address", contractAddress);

  const tx = await ethers
    .getDefaultProvider("goerli")
    .getTransaction(match.hash);

  const contractInterface = new ethers.utils.Interface(HypercertMinterABI);
  const decodedData = contractInterface.parseTransaction({
    data: tx.data,
    value: tx.value,
  });

  const metaDataUri = decodedData.args["_uri"];
  console.log("MetaDataUri", metaDataUri);
  const metadata = await getData(metaDataUri);
  console.log("MetaData", metadata);

  if (!metadata?.allowList) {
    throw new Error(`No allowlist found`);
  }

  const treeResponse = await getData(metadata.allowList);

  if (!treeResponse) {
    throw new Error("Could not fetch json tree dump for allowlist");
  }

  const tree = StandardMerkleTree.load(JSON.parse(treeResponse));

  const addresses: string[] = [];

  // Find the proof
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
    .from("allowlistCache")
    .insert(pairs)
    .select()
    .then((data) => data.data);

  console.log("add result", addResult);
}
