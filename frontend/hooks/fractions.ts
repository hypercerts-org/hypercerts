import { useQuery } from "@tanstack/react-query";
import {
  fractionsByClaim,
  fractionsByOwner,
  fractionById,
} from "@network-goods/hypercerts-sdk";

export const useFractionsByOwner = (owner: string) =>
  useQuery(["graph", "fractions", "owner", owner], () =>
    fractionsByOwner(owner)
  );

export const useFractionsByClaim = (claimId: string) =>
  useQuery(["graph", "fractions", "claim", claimId], () =>
    fractionsByClaim(claimId)
  );

export const useFractionById = (fractionId: string) =>
  useQuery(["graph", "fractions", fractionId], () => fractionById(fractionId));
