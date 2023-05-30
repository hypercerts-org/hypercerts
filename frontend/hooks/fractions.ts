import { useHypercertClient } from "./hypercerts-client";
import { useQuery } from "@tanstack/react-query";

export const useFractionsByOwner = (owner: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  return useQuery(["graph", "fractions", "owner", owner], () =>
    indexer.fractionsByOwner(owner),
  );
};

export const useFractionsByClaim = (claimId: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  return useQuery(["graph", "fractions", "claim", claimId], () =>
    indexer.fractionsByClaim(claimId),
  );
};

export const useFractionById = (fractionId: string) => {
  const {
    client: { indexer },
  } = useHypercertClient();

  return useQuery(["graph", "fractions", fractionId], () =>
    indexer.fractionById(fractionId),
  );
};
