import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { useHypercertClient } from "./hypercerts-client";

export type ClaimProof = {
  proof: string[];
  units: number;
  claimIDContract: string;
};

export const useVerifyFractionClaim = () => {
  const {
    client: { indexer, storage },
  } = useHypercertClient();

  const verifyFractionClaim = async (claimId: string, address: string) => {
    const claimByIdRes = await indexer.claimById(claimId);
    if (!claimByIdRes?.claim) {
      throw new Error("No claim found for ${claimID}");
    }

    const { uri, tokenID: _id } = claimByIdRes.claim;
    const metadata = await storage.getMetadata(uri || "");

    if (!metadata?.allowList) {
      throw new Error(`No allowlist found for ${claimId}`);
    }

    // TODO: this should be retrieved with `getData`, but it fails on res.files()
    // Need to investigate further
    const treeResponse = await storage.getData(metadata.allowList);

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
            proof,
            units: Number(v[1]),
            claimIDContract: _id as string,
          } as ClaimProof;
        }
      }
    }

    throw new Error("Proof could not be found");
  };

  return { verifyFractionClaim };
};
