import { cidToIpfsUri } from "./formatting";
import { hypercertsStorage } from "./hypercerts-storage";
import { claimById } from "@hypercerts-org/hypercerts-sdk";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { toast } from "react-toastify";

export type ClaimProof = {
  proof: string[];
  units: number;
  claimIDContract: string;
};

export const verifyFractionClaim = async (claimId: string, address: string) => {
  const claimByIdRes = await claimById(claimId);
  if (claimByIdRes.isErr) {
    console.log(claimByIdRes.error);
    toast(
      `Could not fetch claim ${claimId} from Graph. Please try again later.`,
    );
    return;
  }

  const { uri, tokenID: _id } = claimByIdRes.claim;
  const metadata = await hypercertsStorage.getMetadata(uri || "");

  if (metadata.isErr) {
    console.log(metadata.error);
    toast(`Could not fetch metadata for ${_id}. Please try again later.`);
    return;
  }

  // TODO: this should be retrieved with `getData`, but it fails on res.files()
  // Need to investigate further
  const treeResponse = await hypercertsStorage.getData(
    cidToIpfsUri(metadata.value.allowList || ""),
  );

  if (treeResponse.isErr) {
    console.log(treeResponse.error);
    toast(`Could not fetch json tree dump for allowlist`);
    return;
  }

  const value: unknown = treeResponse.value;

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

  console.log(`Proof could not be found in tree ${value}`);
  toast(`Proof could not be found`);
};
