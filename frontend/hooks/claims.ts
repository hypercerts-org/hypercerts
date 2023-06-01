import { QueryParams } from "@hypercerts-org/sdk";
import { useQuery } from "@tanstack/react-query";
import { useHypercertClient } from "./hypercerts-client";

export const useClaimMetadata = (cid?: string | null) => {
  const {
    client: { storage },
  } = useHypercertClient();
  return useQuery(["ipfs", "claim", "metadata", cid], () =>
    cid ? storage.getMetadata(cid) : null,
  );
};

export const useListFirstClaims = (params?: QueryParams) => {
  const {
    client: { indexer },
  } = useHypercertClient();
  return useQuery(["firstClaims"], () => indexer.firstClaims(params));
};
