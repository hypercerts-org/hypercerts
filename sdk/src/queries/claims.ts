import { getBuiltGraphSDK } from "../../.graphclient/index.js";
import { getConfig } from "../config.js";

const chain = getConfig({});

const sdk = getBuiltGraphSDK({
  chainName: chain.graphName,
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
