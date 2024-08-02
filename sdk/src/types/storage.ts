import { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  StorageResponse,
  StoreAllowListRequest,
  StoreMetadataRequest,
  StoreMetadataWithAllowlistRequest,
} from "../__generated__/api";

export interface HypercertStorage {
  storeMetadata: (
    request: StoreMetadataRequest,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<StorageResponse, unknown>>;
  storeAllowlist: (
    request: StoreAllowListRequest,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<StorageResponse, unknown>>;
  storeMetadataWithAllowlist: (
    request: StoreMetadataWithAllowlistRequest,
    config?: AxiosRequestConfig,
  ) => Promise<AxiosResponse<StorageResponse, unknown>>;
}
