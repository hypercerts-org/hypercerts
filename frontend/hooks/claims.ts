import { firstClaims, getMetadata } from "@network-goods/hypercerts-sdk";
import { useQuery } from "@tanstack/react-query";

export const useClaimMetadata = (cid?: string | null) =>
  useQuery(["ipfs", "claim", "metadata", cid], async () =>
    cid ? getMetadata(cid) : null
  );

export const useListFirstClaims = () => {
  return useQuery(["firstClaims"], () => firstClaims(10));
};
