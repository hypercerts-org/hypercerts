import { claimById, getData, getMetadata } from "@network-goods/hypercerts-sdk";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export const verifyFractionClaim = async (claimId: string, address: string) => {
  const claimByIdRes = await claimById(claimId);

  if (!claimByIdRes?.claim) {
    throw new Error("No claim found for ${claimID}");
  }

  const { uri, tokenID: _id } = claimByIdRes.claim;
  const metadata = await getMetadata(uri || "");

  if (!metadata?.allowList) {
    throw new Error(`No allowlist found for ${claimId}`);
  }

  const treeResponse = await getData(metadata.allowList);

  if (!treeResponse) {
    throw new Error("Could not fetch json tree dump for allowlist");
  }

  const tree = StandardMerkleTree.load(JSON.parse(treeResponse));

  // Find the proof
  for (const [i, v] of tree.entries()) {
    if (v[0] === address) {
      const proof = tree.getProof(i);
      return { proof, units: Number(v[1]), claimIDContract: _id as string };
    }
  }

  throw new Error("Proof could not be found");
};
