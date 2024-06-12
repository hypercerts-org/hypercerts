import { Environment, HypercertMetadata } from "./types";
import { CreateAllowListRequest, storeAllowList, storeMetadata } from "./__generated__/api";
import { AxiosRequestConfig } from "axios";
import { ENDPOINTS } from "./constants";
import { HypercertStorage } from "./types/storage";

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
}): HypercertStorage => {
  const baseURL = ENDPOINTS[environment];

  const _config = { ...config, baseURL };

  return {
    storeMetadata: async (metadata: HypercertMetadata, config: AxiosRequestConfig = _config) =>
      storeMetadata(metadata, config),
    storeAllowlist: async (createAllowListRequest: CreateAllowListRequest, config: AxiosRequestConfig = _config) =>
      storeAllowList(createAllowListRequest, config),
  };
};
