import { getBuiltGraphSDK } from "../../../.graphclient/index.js";
import { getConfig } from "../../utils/config.js";
import { QueryParams, defaultQueryParams } from "../utils.js";

const config = getConfig({});

const sdk = getBuiltGraphSDK({ chainName: config.graphName });

/**
 * @deprecated Refactored this funtionality into the client
 */
export const fractionsByOwner = async (owner: string, params: QueryParams = defaultQueryParams) =>
  sdk.ClaimTokensByOwner({
    owner,
    ...params,
  });

/**
 * @deprecated Refactored this funtionality into the client
 */
export const fractionsByClaim = async (claimId: string, params: QueryParams = defaultQueryParams) =>
  sdk.ClaimTokensByClaim({
    claimId,
    ...params,
  });

/**
 * @deprecated Refactored this funtionality into the client
 */
export const fractionById = async (fractionId: string) =>
  sdk.ClaimTokenById({
    claimTokenId: fractionId,
  });
