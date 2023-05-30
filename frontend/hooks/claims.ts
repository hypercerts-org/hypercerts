import { hypercertsStorage } from "../lib/hypercerts-storage";
import { firstClaims, QueryParams } from "@hypercerts-org/sdk";
import { useQuery } from "@tanstack/react-query";

export const useClaimMetadata = (cid?: string | null) =>
  useQuery(["ipfs", "claim", "metadata", cid], async () =>
    cid ? hypercertsStorage.getMetadata(cid) : null,
  );

export const useListFirstClaims = (params?: QueryParams) => {
  return useQuery(["firstClaims"], () => firstClaims(params));
};
