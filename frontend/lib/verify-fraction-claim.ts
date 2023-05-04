import { hypercertsStorage } from "./hypercerts-storage";
import { claimById, ClaimProof } from "@hypercerts-org/hypercerts-sdk";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export const verifyFractionClaim = async (
  claimId: string,
  address: string,
): Promise<ClaimProof> => {
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
  const treeResponse = await hypercertsStorage.getData(metadata.allowList);

  if (!treeResponse) {
    throw new Error("Could not fetch json tree dump for allowlist");
  }

  const value: unknown = treeResponse;

  if (typeof value === "string") {
    // Load the tree
    const tree = StandardMerkleTree.load(JSON.parse(value));

    // Find the proof
    for (const [i, v] of tree.entries()) {
      if (v[0] === address) {
        const proof = tree.getProof(i);
        return {
          root: tree.root,
          proof,
          units: Number(v[1]),
          claimId: _id as string,
        };
      }
    }
  }

  throw new Error("Proof could not be found");
};
