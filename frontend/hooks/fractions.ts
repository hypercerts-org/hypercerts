import { useHypercertClient } from "./hypercerts-client";
import { useQuery } from "@tanstack/react-query";

export const useFractionsByOwner = (owner: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  return useQuery(
    ["graph", "fractions", "owner", owner],
    () => indexer.fractionsByOwner(owner),
    { enabled: !!owner, refetchInterval: 5000 },
  );
};

export const useFractionsByClaim = (claimId: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  return (
    useQuery(["graph", "fractions", "claim", claimId], () =>
      indexer.fractionsByClaim(claimId),
    ),
    { enabled: !!claimId, refetchInterval: 5000 }
  );
};

export const useFractionById = (fractionId: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  return useQuery(
    ["graph", "fractions", fractionId],
    () => indexer.fractionById(fractionId),
    { enabled: !!fractionId, refetchInterval: 5000 },
  );
};
