import { getBuiltGraphSDK } from "./.graphclient/index.js";

const sdk = getBuiltGraphSDK();

export const fractionsByOwner = async (owner: string) => sdk.ClaimTokensByOwner({ owner });

export const fractionsByClaim = async (claimId: string) => sdk.ClaimTokensByClaim({ claimId });

export const fractionById = async (fractionId: string) => sdk.ClaimTokenById({ claimTokenId: fractionId });
