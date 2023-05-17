import { getBuiltGraphSDK } from "../../.graphclient/index.js";
import { getConfig } from "../utils/config.js";

const config = getConfig({});
const sdkConfig = { chainName: config.graphName };

const sdk = getBuiltGraphSDK(sdkConfig);

type QueryParams = {
  orderDirections: "asc" | "desc";
  skip: number;
  first: number;
  paginate: boolean;
  live: boolean;
  [key: string]: any;
};

const defaultQueryParams: QueryParams = {
  orderDirections: "desc",
  skip: 0,
  first: 100,
  paginate: false,
  live: false,
};

export const claimsByOwner = async (owner: string, params: QueryParams = defaultQueryParams) =>
  sdk.ClaimsByOwner({
    owner,
    ...params,
  });

export const claimById = async (id: string) =>
  sdk.ClaimById({
    id,
  });

export const firstClaims = async (params: QueryParams = defaultQueryParams) =>
  sdk.RecentClaims({
    ...params,
  });
