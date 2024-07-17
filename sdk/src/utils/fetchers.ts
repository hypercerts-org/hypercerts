import { StorageError } from "../types/errors";
import { logger } from "./logger";
import axios from "axios";

/**
 * Fetches data from IPFS using either the DWeb IPFS, NFT Storage, or the Web3Up gateway.
 *
 * This function attempts to fetch data from all gateways at the same time and returns on the first on to resolve.
 * If the data cannot be fetched from any gateway, it throws a `StorageError`.
 *
 * @param {string} cidOrIpfsUri - The CID or IPFS URI of the data to fetch.
 * @param {StorageConfigOverrides} [config] - An optional configuration object.
 * @returns {Promise<unknown>} The data fetched from IPFS.
 * @throws {StorageError} Will throw a `StoragjeError` if the data cannot be fetched from either gateway.
 * @async
 */
const getFromIPFS = async (cidOrIpfsUri: string, timeout: number = 10000): Promise<unknown> => {
  const requests = [
    axios.get(getDwebLinkGatewayUri(cidOrIpfsUri), { timeout }),
    axios.get(getNftStorageGatewayUri(cidOrIpfsUri), { timeout }),
    axios.get(getWeb3UpGatewayUri(cidOrIpfsUri), { timeout }),
  ];

  logger.debug(`Getting metadata for ${cidOrIpfsUri}`);

  const res = await Promise.any(requests)
    .then()
    .catch((err) => {
      logger.error(err);
      throw new StorageError(`Failed to get ${cidOrIpfsUri}`, { error: err });
    });

  if (!res || !res.data) {
    throw new StorageError(`Failed to get ${cidOrIpfsUri}`);
  }

  return res.data;
};

const getCid = (cidOrIpfsUri: string) => cidOrIpfsUri.replace("ipfs://", "");

const getDwebLinkGatewayUri = (cidOrIpfsUri: string) => {
  const DWEB_LINK_IPFS_GATEWAY = "https://{cid}.ipfs.dweb.link/";
  return DWEB_LINK_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
};

const getNftStorageGatewayUri = (cidOrIpfsUri: string) => {
  const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
  return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
};

const getWeb3UpGatewayUri = (cidOrIpfsUri: string) => {
  const WEB3_STORAGE_IPFS_GATEWAY = "https://w3s.link/ipfs/{cid}";
  return WEB3_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
};

export { getFromIPFS };

export const fetchFromHTTPS = async ({ uri }: { uri: string }) => {
  // URL validation
  const url = new URL(uri);
  try {
    const res = await axios.get(url.toString());

    if (!res || !res.data) {
      return;
    }

    return res.data;
  } catch (error) {
    console.error(`Failed to get metadata from URI ${uri} `, error);
    return;
  }
};

export const fetchFromHttpsOrIpfs = async (uri?: string): Promise<unknown> => {
  if (!uri || uri === "ipfs://null" || uri === "ipfs://") {
    console.error("[fetchFromHttpsOrIpfs] URI is missing");
    return;
  }

  let fetchResult;

  // Try from IPFS
  if (uri.startsWith("ipfs://")) {
    fetchResult = await getFromIPFS(uri);
  }

  // Try from HTTPS
  if (uri.startsWith("https://")) {
    fetchResult = await fetchFromHTTPS({ uri });
  }

  // If nothing found yet, try from IPFS as CID
  if (!fetchResult) {
    fetchResult = await getFromIPFS(uri);
  }

  return fetchResult;
};
