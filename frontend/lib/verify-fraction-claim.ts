import { claimById } from "@hypercerts-org/hypercerts-sdk";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { hypercertsStorage } from "./hypercerts-storage";

export const verifyFractionClaim = async (claimId: string, address: string) => {
  const claimByIdRes = await claimById(claimId);

  if (!claimByIdRes?.claim) {
    throw new Error("No claim found for ${claimID}");
  }

  const { uri, tokenID: _id } = claimByIdRes.claim;
  const metadata = await hypercertsStorage.getMetadata(uri || "");

  if (!metadata?.allowList) {
    throw new Error(`No allowlist found for ${claimId}`);
  }

  // TODO: this should be retrieved with `getData`, but it fails on res.files()
  // Need to investigate further
  const treeResponse = await hypercertsStorage.getMetadata(metadata.allowList);

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
