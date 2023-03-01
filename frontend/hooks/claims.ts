import { firstClaims } from "@hypercerts-org/hypercerts-sdk";
import { useQuery } from "@tanstack/react-query";
import { hypercertsStorage } from "../lib/hypercerts-storage";

export const useClaimMetadata = (cid?: string | null) =>
  useQuery(["ipfs", "claim", "metadata", cid], async () =>
    cid ? hypercertsStorage.getMetadata(cid) : null,
  );

export const useListFirstClaims = () => {
  return useQuery(["firstClaims"], () => firstClaims(10));
};
