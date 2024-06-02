import axios from "axios";
import { ENDPOINTS } from "../../src/constants";
import { HypercertMetadata, StorageConfigOverrides, StorageError } from "../../src/types";

/**
 * Type for the request body when posting to the allowlist endpoint.
 */
type AllowListPostRequest = {
  allowList: string;
  totalUnits: string;
};

// /**
//  * Type for the response data from the API.
//  */
// type ResponseData<T> = {
//   success: boolean;
//   message: string;
//   data?: T;
//   errors?: Record<string, string | string[]>;
// };

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
//TODO fix response typing based on updated API spec
const uploadMetadata = async (metadata: HypercertMetadata, config: StorageConfigOverrides = { timeout: 0 }) => {
  const res = await api.post(ENDPOINTS.metadata, metadata, config);

  if (!res) {
    throw new StorageError("Failed to store metadata", { errors: {}, cid: undefined });
  }

  return res.data;
};

/**
 * Uploads an allowlist to the API.
 *
 * @param {HypercertMetadata} req - The request body containing the allowlist and total units. The allowList should be a stringified Merkle tree dump.
 * @param {StorageConfigOverrides} [config] - An optional configuration object.
 * @returns The response data from the API.
 *
 */
//TODO fix response typing based on updated API spec
const uploadAllowlist = async (req: AllowListPostRequest, config: StorageConfigOverrides = { timeout: 0 }) => {
  const res = await api.post(ENDPOINTS.allowlist, req, config);

  if (!res) {
    throw new StorageError("Failed to store allow list", { errors: {}, cid: undefined });
  }

  return res.data;
};

export { uploadMetadata, uploadAllowlist };
