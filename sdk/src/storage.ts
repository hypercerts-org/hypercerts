import { Environment, HypercertMetadata } from "./types";
import { CreateAllowListRequest, storeAllowList, storeMetadata } from "./__generated__/api";
import axios, { AxiosRequestConfig } from "axios";
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
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  const _config = {
    ...config,
    baseURL: ENDPOINTS[environment],
  };

  return {
    storeMetadata: async (metadata: HypercertMetadata, config: AxiosRequestConfig = {}) =>
      storeMetadata(metadata, { ..._config, ...config }),
    storeAllowlist: async (createAllowListRequest: CreateAllowListRequest, config: AxiosRequestConfig = {}) =>
      storeAllowList(createAllowListRequest, { ..._config, ...config }),
  };
};
