import { ethers } from "ethers";
import { AutotaskEvent, SentinelTriggerEvent } from "defender-autotask-utils";
import axios from "axios";

import { createClient } from "@supabase/supabase-js";
import { abi } from "../HypercertMinterABI.js";

const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
export const getData = async (cid: string) => {
  const nftStorageGatewayLink = NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cid);
  console.log(`Getting metadata ${cid} at ${nftStorageGatewayLink}`);

  return axios.get(nftStorageGatewayLink).then((result) => result.data);
};

export async function handler(event: AutotaskEvent) {
  // console.log("Event", event);
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = event.secrets;
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

  const contractInterface = new ethers.utils.Interface(abi);
  const decodedData = contractInterface.parseTransaction({
    data: tx.data,
    value: tx.value,
  });

  const claimId = decodedData.args["claimID"] as string;
  const formattedClaimId = `${contractAddress}-${claimId
    .toString()
    .toLowerCase()}`;

  // TODO: Add authentication
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const deleteResult = await client
    .from("allowlistCache")
    .delete()
    .eq("address", fromAddress)
    .eq("claimId", formattedClaimId)
    .select();
  console.log("Deleted", deleteResult);
}
