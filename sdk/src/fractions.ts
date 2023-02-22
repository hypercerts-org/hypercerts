import { getBuiltGraphSDK } from "./.graphclient/index.js";

const sdk = getBuiltGraphSDK();

export const fractionsByOwner = async (owner: string) =>
  sdk.ClaimTokensByOwner({
    owner,
    chainNames: ["goerli"],
  });

export const fractionsByClaim = async (claimId: string) =>
  sdk.ClaimTokensByClaim({
    claimId,
    chainNames: ["goerli"],
  });

export const fractionById = async (fractionId: string) =>
  sdk.ClaimTokenById({
    claimTokenId: fractionId,
    chainNames: ["goerli"],
  });
