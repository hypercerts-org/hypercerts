import { getBuiltGraphSDK } from "../../.graphclient/index.js";
import { getConfig } from "../utils/config.js";

const config = getConfig({});
const sdkConfig = { chainName: config.graphName };

const sdk = getBuiltGraphSDK(sdkConfig);

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
