import { useQuery } from "@tanstack/react-query";
import { useHypercertClient } from "./hypercerts-client";

export const useFractionsByOwner = (owner: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  return useQuery({
    queryKey: ["graph", "fractions", "owner", owner],
    queryFn: () => indexer.fractionsByOwner(owner),
  });
};

export const useFractionsByClaim = (claimId: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  useQuery({
    queryKey: ["graph", "fractions", "claim", claimId],
    queryFn: () => indexer.fractionsByClaim(claimId),
  });
};

export const useFractionById = (fractionId: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  useQuery({
    queryKey: ["graph", "fractions", fractionId],
    queryFn: () => indexer.fractionById(fractionId),
  });
};
