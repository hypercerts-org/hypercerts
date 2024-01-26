import axios from "axios";
import { HypercertMetadata, StorageConfigOverrides } from "src/types";

/**
 * Type for the request body when posting to the allowlist endpoint.
 */
type AllowListPostRequest = {
  allowList: string;
  totalUnits: string;
};

/**
 * Type for the response data from the API.
 */
type ResponseData<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string | string[]>;
};

/**
 * Axios instance configured with the base URL for the hypercert API.
 */
const api = axios.create({ headers: { "Content-Type": "application/json" } });

/**
 * Uploads metadata to the API.
 *
 * @param {HypercertMetadata} metadata - The metadata to upload. Should be an object that conforms to the HypercertMetadata type.
 * @param {StorageConfigOverrides} [config] - An optional configuration object.
 * @returns The response data from the API.
 */
const uploadMetadata = async (metadata: HypercertMetadata, config: StorageConfigOverrides = { timeout: 0 }) => {
  const response = await api.post<ResponseData<{ cid: string }>>(
    "https://hypercerts-api-production.up.railway.app/api/v1/web3up/metadata",
    metadata,
    config,
  );

  return response.data;
};

/**
 * Uploads an allowlist to the API.
 *
 * @param {HypercertMetadata} req - The request body containing the allowlist and total units. The allowList should be a stringified Merkle tree dump.
 * @param {StorageConfigOverrides} [config] - An optional configuration object.
 * @returns The response data from the API.
 *
 */
const uploadAllowlist = async (req: AllowListPostRequest, config: StorageConfigOverrides = { timeout: 0 }) => {
  const response = await api.post<ResponseData<{ cid: string }>>(
    "https://hypercerts-api-production.up.railway.app/api/v1/web3up/allowlist",
    req,
    config,
  );

  return response.data;
};

export { uploadMetadata, uploadAllowlist };
