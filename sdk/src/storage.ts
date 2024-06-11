import { Environment, HypercertMetadata } from "./types";
import {
  CreateAllowListRequest,
  StoreAllowList201,
  StoreMetadata201,
  storeAllowList,
  storeMetadata,
} from "./__generated__/api";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ENDPOINTS } from "./constants";

export interface HypercertStorage {
  storeMetadata: (
    metadata: HypercertMetadata,
    config: AxiosRequestConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<AxiosResponse<StoreMetadata201, any>>;
  storeAllowlist: (
    createAllowListRequest: CreateAllowListRequest,
    config: AxiosRequestConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<AxiosResponse<StoreAllowList201, any>>;
}

/**
 * An utility methods that provides storage functionality for hypercerts metadata and allow lists.
 *
 */
export const getStorage = ({
  environment,
  config = { timeout: 0 },
}: {
  environment: Environment;
  config?: AxiosRequestConfig;
}) => {
  const baseURL = ENDPOINTS[environment];

  const _config = { ...config, baseURL };

  return {
    storeMetadata: async (metadata: HypercertMetadata, config: AxiosRequestConfig = _config) =>
      storeMetadata(metadata, config),
    storeAllowlist: async (createAllowListRequest: CreateAllowListRequest, config: AxiosRequestConfig = _config) =>
      storeAllowList(createAllowListRequest, config),
  };
};
