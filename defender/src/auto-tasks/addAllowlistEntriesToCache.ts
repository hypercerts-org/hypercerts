import { ethers } from "ethers";
import { AutotaskEvent, SentinelTriggerEvent } from "defender-autotask-utils";

import * as hypercertsSDK from "@network-goods/hypercerts-sdk";

import { createClient } from "@supabase/supabase-js";
import { abi } from "../HypercertMinterABI.js";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

exports.handler = async function (event: AutotaskEvent) {
  console.log(event);
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = event.secrets;
  const match = event.request.body as SentinelTriggerEvent;

  const tx = await ethers
    .getDefaultProvider("goerli")
    .getTransaction(match.hash);

  const iface = new ethers.utils.Interface(abi);
  const decodedData = iface.parseTransaction({
    data: tx.data,
    value: tx.value,
  });

  const metaDataUri = decodedData.args["_uri"];

  const metadata = await hypercertsSDK.getMetadata(metaDataUri);

  if (!metadata?.allowList) {
    throw new Error(`No allowlist found`);
  }

  const treeResponse = await hypercertsSDK.getData(metadata.allowList);

  if (!treeResponse) {
    throw new Error("Could not fetch json tree dump for allowlist");
  }

  const tree = StandardMerkleTree.load(JSON.parse(treeResponse));

  const addresses: string[] = [];

  // Find the proof
  for (const [i, v] of tree.entries()) {
    addresses.push(v[0]);
  }

  console.log(decodedData);

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // TODO: Get correct pairs from emitted event, by downloading and parsing allowlist
  const pairs = [{ address: "0x0x0x0x", claimId: "AAA" }];

  return client
    .from("allowlistCache")
    .insert(pairs)
    .then((data) => data.data);
};
