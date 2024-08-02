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
 * An utility service that provides storage functionality for hypercerts metadata and allow lists by exposing a set of methods to interact with the storage service API.
 *
 * @param environment - The environment in which the storage will operate.
 * @param config - Optional Axios configuration for the request.
 * @returns An object containing methods to store metadata and allowlists.
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
    /**
     * Stores metadata for a hypercert.
     * @param request - The request object containing metadata to be stored.
     * @param config - Optional Axios configuration for the request.
     * @returns A promise that resolves when the metadata is stored.
     */
    storeMetadata: async (request: StoreMetadataRequest, config: AxiosRequestConfig = {}) =>
      storeMetadata(request, { ..._config, ...config }),

    /**
     * Stores an allowlist for a hypercert.
     * @param request - The request object containing the allowlist to be stored.
     * @param config - Optional Axios configuration for the request.
     * @returns A promise that resolves when the allowlist is stored.
     */
    storeAllowlist: async (request: StoreAllowListRequest, config: AxiosRequestConfig = {}) =>
      storeAllowList(request, { ..._config, ...config }),

    /**
     * Stores metadata and an allowlist for a hypercert.
     * @param request - The request object containing metadata and allowlist to be stored.
     * @param config - Optional Axios configuration for the request.
     * @returns A promise that resolves when the metadata and allowlist are stored.
     */
    storeMetadataWithAllowlist: async (request: StoreMetadataWithAllowlistRequest, config: AxiosRequestConfig = {}) =>
      storeMetadataWithAllowlist(request, { ..._config, ...config }),
  };
};
