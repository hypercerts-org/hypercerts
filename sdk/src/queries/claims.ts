import { getBuiltGraphSDK } from "../../.graphclient/index.js";
import { getChain } from "../constants.js";

const chain = getChain();

const sdk = getBuiltGraphSDK({
  chainName: chain.graph,
});

export const claimsByOwner = async (owner: string) =>
  sdk.ClaimsByOwner({
    owner,
  });

export const claimById = async (id: string) =>
  sdk.ClaimById({
    id,
  });

export const firstClaims = async (first: number) =>
  sdk.RecentClaims({
    first,
  });
