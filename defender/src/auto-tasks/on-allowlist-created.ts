import { ethers } from "ethers";
import { AutotaskEvent, SentinelTriggerEvent } from "defender-autotask-utils";
import axios from "axios";
import crypto from "crypto";

import { createClient } from "@supabase/supabase-js";
import { abi } from "../HypercertMinterABI.js";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
export const getData = async (cid: string) => {
  const nftStorageGatewayLink = NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cid);
  console.log(`Getting metadata ${cid} at ${nftStorageGatewayLink}`);

  return axios.get(nftStorageGatewayLink).then((result) => result.data);
};

exports.handler = async function (event: AutotaskEvent) {
  console.log(event);
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = event.secrets;
  const match = event.request.body as SentinelTriggerEvent;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const tokenId = match.matchReasons[0].params.tokenID as string;
  console.log("TokenId", tokenId);

  const tx = await ethers
    .getDefaultProvider("goerli")
    .getTransaction(match.hash);

  const contractInterface = new ethers.utils.Interface(abi);
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
  //
  // const addresses: string[] = [];
  //
  // // Find the proof
  // for (const [, v] of tree.entries()) {
  //   addresses.push(v[0]);
  // }
  // console.log("addresses", addresses);
  // const pairs = addresses.map((address) => ({ address, claimId: tokenId }));
  // console.log("pairs", pairs);

  // const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  //
  // const addResult = await client
  //   .from("allowlistCache")
  //   .insert(pairs)
  //   .then((data) => data.data);
  // console.log("add result", addResult);
};
