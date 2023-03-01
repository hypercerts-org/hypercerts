import { firstClaims, HypercertsStorage } from "@hypercerts-org/hypercerts-sdk";
import { useQuery } from "@tanstack/react-query";
import { NFT_STORAGE_TOKEN, WEB3_STORAGE_TOKEN } from "../lib/config";

const storage = new HypercertsStorage({
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
});

export const useClaimMetadata = (cid?: string | null) =>
  useQuery(["ipfs", "claim", "metadata", cid], async () =>
    cid ? storage.getMetadata(cid) : null,
  );

export const useListFirstClaims = () => {
  return useQuery(["firstClaims"], () => firstClaims(10));
};
