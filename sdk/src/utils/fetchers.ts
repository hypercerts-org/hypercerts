import { StorageError } from "../types/errors";
import logger from "./logger";
import axios from "axios";

/**
 * Fetches data from IPFS using either the NFT Storage gateway or the Web3 Storage gateway.
 *
 * This function attempts to fetch data from the NFT Storage gateway first. If the request times out, it then tries to fetch the data from the Web3 Storage gateway.
 * If the data cannot be fetched from either gateway, it throws a `StorageError`.
 *
 * @param {string} cidOrIpfsUri - The CID or IPFS URI of the data to fetch.
 * @param {number} [timeout=10000] - The timeout for the fetch request in milliseconds. Defaults to 10000ms.
 * @returns {Promise<unknown>} The data fetched from IPFS.
 * @throws {StorageError} Will throw a `StoragjeError` if the data cannot be fetched from either gateway.
 * @async
 */
const getFromIPFS = async (cidOrIpfsUri: string, timeout: number = 10000): Promise<unknown> => {
  const nftStorageGatewayLink = getNftStorageGatewayUri(cidOrIpfsUri);
  const web3StorageGatewayLink = getWeb3StorageGatewayUri(cidOrIpfsUri);
  logger.debug(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);

  const res = await axios.get(nftStorageGatewayLink, { timeout }).catch(() => {
    logger.debug(`${nftStorageGatewayLink} timed out.`);
    logger.debug(`Getting metadata ${cidOrIpfsUri} at ${web3StorageGatewayLink}`);
    return axios.get(web3StorageGatewayLink, { timeout });
  });

  if (!res || !res.data) {
    throw new StorageError(`Failed to get ${cidOrIpfsUri}`);
  }

  return res.data;
};

const getCid = (cidOrIpfsUri: string) => cidOrIpfsUri.replace("ipfs://", "");

const getNftStorageGatewayUri = (cidOrIpfsUri: string) => {
  const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
  return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
};

const getWeb3StorageGatewayUri = (cidOrIpfsUri: string) => {
  const WEB3_STORAGE_IPFS_GATEWAY = "https://w3s.link/ipfs/{cid}";
  return WEB3_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
};

export default { getFromIPFS };
