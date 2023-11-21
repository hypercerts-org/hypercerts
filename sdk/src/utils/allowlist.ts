import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fetchers from "./fetchers";
import logger from "./logger";

const getMerkleTreeFromIPFS = async (cidOrIpfsUri: string) => {
  const data = await fetchers.getFromIPFS(cidOrIpfsUri);
  const allowlist = typeof data === "string" ? data : undefined;

  if (!allowlist) {
    throw new Error(`Invalid allowlist at ${cidOrIpfsUri}`);
  }

  const tree = StandardMerkleTree.load(JSON.parse(allowlist));

  if (!tree) {
    throw new Error(`Invalid allowlist at ${cidOrIpfsUri}`);
  }

  return tree;
};

/**
 * This function retrieves proofs from an allowlist.
 *
 * It fetches a Merkle tree from IPFS using a given CID or IPFS URI, then iterates over the tree to find an account.
 * When the account is found, it generates a proof for that account and logs the account, index, and proof as debug.
 * It returns the proof and the root of the Merkle tree.
 *
 * @param cidOrIpfsUri - The CID or IPFS URI to fetch the Merkle tree from.
 * @param account - The account to find in the Merkle tree.
 * @returns An object containing the proof for the account and the root of the Merkle tree.
 * @throws Will throw an error if the Merkle tree cannot be fetched.
 * @async
 */
const getProofsFromAllowlist = async (cidOrIpfsUri: string, account: `0x${string}`) => {
  const tree = await getMerkleTreeFromIPFS(cidOrIpfsUri);
  for (const [i, v] of tree.entries()) {
    if (v[0] === account) {
      const proof = tree.getProof(i);
      logger.debug(`Found ${account} at index ${i} with proof ${proof}`);
      return { proof, root: tree.root };
    }
  }
};

export default { getProofsFromAllowlist };
