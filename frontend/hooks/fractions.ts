import { useHypercertClient } from "./hypercerts-client";
import { useQuery } from "@tanstack/react-query";

export const useFractionsByOwner = (owner: string) => {
  const { client } = useHypercertClient();

  return useQuery(
    ["graph", "fractions", "owner", owner],
    () => {
      if (!client) return null;
      return client.indexer.fractionsByOwner(owner);
    },
    { enabled: !!owner, refetchInterval: 5000 },
  );
};

export const useFractionsByClaim = (claimId: string) => {
  const { client } = useHypercertClient();

  return useQuery(
    ["graph", "fractions", "claim", claimId],
    () => {
      if (!client) return null;
      return client.indexer.fractionsByClaim(claimId);
    },
    { enabled: !!claimId, refetchInterval: 5000 },
  );
};

export const useFractionById = (fractionId: string) => {
  const { client } = useHypercertClient();

  return useQuery(
    ["graph", "fractions", fractionId],
    () => {
      if (!client) return null;
      return client.indexer.fractionById(fractionId);
    },
    { enabled: !!fractionId },
  );
};

export const useClaimById = (claimId?: string | null) => {
  const { client } = useHypercertClient();

  return useQuery(
    ["graph", "claims", claimId],
    () => {
      if (!client) return null;
      if (!claimId) return null;
      return client.indexer.claimById(claimId);
    },
    { enabled: !!claimId && !!client },
  );
};

export const useClaimMetadataByUri = (uri?: string | null) => {
  const { client } = useHypercertClient();

  return useQuery(
    ["graph", "claim-metadata", uri],
    () => {
      if (!client) return null;
      if (!uri) return null;
      return client.storage.getMetadata(uri);
    },
    { enabled: !!uri && !!client },
  );
};
