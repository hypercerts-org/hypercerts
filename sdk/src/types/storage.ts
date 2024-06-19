import { AxiosRequestConfig, AxiosResponse } from "axios";
import { StoreMetadata201, CreateAllowListRequest, StoreAllowList201 } from "../__generated__/api";
import { HypercertMetadata } from "./metadata";

export interface HypercertStorage {
  storeMetadata: (
    metadata: HypercertMetadata,
    config?: AxiosRequestConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<AxiosResponse<StoreMetadata201, any>>;
  storeAllowlist: (
    createAllowListRequest: CreateAllowListRequest,
    config?: AxiosRequestConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<AxiosResponse<StoreAllowList201, any>>;
}
