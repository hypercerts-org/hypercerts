import { ethers } from "ethers";
import { AutotaskEvent, SentinelTriggerEvent } from "defender-autotask-utils";
import axios from "axios";

import { createClient } from "@supabase/supabase-js";
import { abi } from "../HypercertMinterABI.js";
import { contractAddress } from "../config.js";

const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
export const getData = async (cid: string) => {
  const nftStorageGatewayLink = NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cid);
  console.log(`Getting metadata ${cid} at ${nftStorageGatewayLink}`);

  return axios.get(nftStorageGatewayLink).then((result) => result.data);
};

export async function handler(event: AutotaskEvent) {
  console.log("Event", event);
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = event.secrets;
  const match = event.request.body as SentinelTriggerEvent;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fromAddress = match.transaction.from;
  console.log("From address", fromAddress);

  const tx = await ethers
    .getDefaultProvider("goerli")
    .getTransaction(match.hash);

  const contractInterface = new ethers.utils.Interface(abi);
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

  // TODO: Add authentication
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const deleteResult = await client
    .from("allowlistCache")
    .delete()
    .eq("address", fromAddress)
    .in("claimId", formattedClaimIds)
    .select();

  console.log("delete result", deleteResult);
}
