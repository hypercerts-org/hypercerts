import { getBuiltGraphSDK } from "../../.graphclient/index.js";
import { getConfig } from "../utils/config.js";
import { QueryParams, defaultQueryParams } from "./utils.js";

const config = getConfig({});
const sdkConfig = { chainName: config.graphName };

const sdk = getBuiltGraphSDK(sdkConfig);

export const fractionsByOwner = async (owner: string, params: QueryParams = defaultQueryParams) =>
  sdk.ClaimTokensByOwner({
    owner,
    ...params,
  });

export const fractionsByClaim = async (claimId: string, params: QueryParams = defaultQueryParams) =>
  sdk.ClaimTokensByClaim({
    claimId,
    ...params,
  });

export const fractionById = async (fractionId: string) =>
  sdk.ClaimTokenById({
    claimTokenId: fractionId,
  });
