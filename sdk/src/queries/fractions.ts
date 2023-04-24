import { getBuiltGraphSDK } from "../../.graphclient/index.js";
import { getConfig } from "../utils/config.js";

const config = getConfig({});
const sdkConfig = { chainName: config.chainName };

const sdk = getBuiltGraphSDK(sdkConfig);

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
