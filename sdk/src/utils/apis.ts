import axios from "axios";
import { HypercertMetadata } from "src/types";

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
type ResponseData = {
  message: string;
  cid?: string;
  errors?: Record<string, string | string[]>;
};

/**
 * Axios instance configured with the base URL for the hypercert API.
 */
const api = axios.create({
  baseURL: "https://hypercerts-api.vercel.app/api/v1/web3up/",
});

/**
 * Uploads metadata to the API.
 *
 * @param metadata - The metadata to upload. Should be an object that conforms to the HypercertMetadata type.
 * @returns The response data from the API.
 */
const uploadMetadata = async (metadata: HypercertMetadata) => {
  const response = await api.post<ResponseData>("metadata", metadata);

  return response.data;
};

/**
 * Uploads an allowlist to the API.
 *
 * @param req - The request body containing the allowlist and total units. The allowList should be a stringified Merkle tree dump.
 * @returns The response data from the API.
 *
 */
const uploadAllowlist = async (req: AllowListPostRequest) => {
  const response = await api.post<ResponseData>("allowlist", req);

  return response.data;
};

export { uploadMetadata, uploadAllowlist };
