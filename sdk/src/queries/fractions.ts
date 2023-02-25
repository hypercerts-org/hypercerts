import { getChain } from "../constants.js";
import { getBuiltGraphSDK } from "../../.graphclient/index.js";

const chain = getChain();

const sdk = getBuiltGraphSDK({ chainName: chain.graph });

export const fractionsByOwner = async (owner: string) =>
  sdk.ClaimTokensByOwner({
    owner,
  });

export const fractionsByClaim = async (claimId: string) =>
  sdk.ClaimTokensByClaim({
    claimId,
  });

export const fractionById = async (fractionId: string) =>
  sdk.ClaimTokenById({
    claimTokenId: fractionId,
  });
