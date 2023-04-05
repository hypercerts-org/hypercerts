import { getBuiltGraphSDK } from "../../.graphclient/index.js";
import { getConfig } from "../config.js";

const chain = getConfig({});

const sdk = getBuiltGraphSDK({ chainName: chain.graphName });

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
