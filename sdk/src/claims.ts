import { getBuiltGraphSDK } from "./.graphclient/index.js";

const sdk = getBuiltGraphSDK();

export const claimsByOwner = async (owner: string) =>
  sdk.ClaimsByOwner({
    owner,
    chainNames: ["goerli"],
  });

export const claimById = async (id: string) =>
  sdk.ClaimById({
    id,
    chainNames: ["goerli"],
  });

export const firstClaims = async (first: number) =>
  sdk.RecentClaims({
    first,
    chainNames: ["goerli"],
  });
