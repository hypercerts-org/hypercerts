import {
  fractionsByClaim,
  fractionsByOwner,
  fractionById,
} from "@hypercerts-org/hypercerts-sdk";
import { useQuery } from "@tanstack/react-query";

export const useFractionsByOwner = (owner: string) =>
  useQuery(["graph", "fractions", "owner", owner], () =>
    fractionsByOwner(owner),
  );

export const useFractionsByClaim = (claimId: string) =>
  useQuery(["graph", "fractions", "claim", claimId], () =>
    fractionsByClaim(claimId),
  );

export const useFractionById = (fractionId: string) =>
  useQuery(["graph", "fractions", fractionId], () => fractionById(fractionId));
