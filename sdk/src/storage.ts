import { Environment } from "./types";
import {
  storeAllowList,
  StoreAllowListRequest,
  storeMetadata,
  StoreMetadataRequest,
  storeMetadataWithAllowlist,
  StoreMetadataWithAllowlistRequest,
} from "./__generated__/api";
import axios, { AxiosRequestConfig } from "axios";
import { ENDPOINTS } from "./constants";
import { HypercertStorage } from "./types/storage";

/**
 * An utility methods that provides storage functionality for hypercerts metadata and allow lists.
 *
 */
export const getStorage = ({
  environment,
  config,
}: {
  environment: Environment;
  config?: AxiosRequestConfig;
}): HypercertStorage => {
  axios.defaults.headers.post["Content-Type"] = "application/json";
  axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
  const _config: AxiosRequestConfig = {
    ...config,
    timeout: 20000,
    baseURL: ENDPOINTS[environment],
  };

  return {
    storeMetadata: async (request: StoreMetadataRequest, config: AxiosRequestConfig = {}) =>
      storeMetadata(request, { ..._config, ...config }),
    storeAllowlist: async (request: StoreAllowListRequest, config: AxiosRequestConfig = {}) =>
      storeAllowList(request, { ..._config, ...config }),
    storeMetadataWithAllowlist: async (request: StoreMetadataWithAllowlistRequest, config: AxiosRequestConfig = {}) =>
      storeMetadataWithAllowlist(request, { ..._config, ...config }),
  };
};
