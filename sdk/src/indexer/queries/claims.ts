import { getBuiltGraphSDK } from "../../../.graphclient/index.js";
import { getConfig } from "../../utils/config.js";
import { QueryParams, defaultQueryParams } from "../utils.js";

const config = getConfig({});
const sdkConfig = { chainName: config.graphName };

const sdk = getBuiltGraphSDK(sdkConfig);

/**
 * @deprecated Refactored this funtionality into the client
 */
export const claimsByOwner = async (owner: string, params: QueryParams = defaultQueryParams) =>
  sdk.ClaimsByOwner({
    owner,
    ...params,
  });

/**
 * @deprecated Refactored this funtionality into the client
 */
export const claimById = async (id: string) =>
  sdk.ClaimById({
    id,
  });

/**
 * @deprecated Refactored this funtionality into the client
 */
export const firstClaims = async (params: QueryParams = defaultQueryParams) =>
  sdk.RecentClaims({
    ...params,
  });
