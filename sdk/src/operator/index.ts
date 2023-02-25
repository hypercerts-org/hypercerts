import axios from "axios";
// @ts-ignore
import { NFTStorage, CIDString, Blob } from "nft.storage";
// @ts-ignore
import { Web3Storage, File } from "web3.storage";
import { HypercertMetadata } from "../types/metadata.js";
import { FetchError, MalformedDataError } from "../errors.js";
import { getStorage } from "../constants.js";

// Storage keys
const storageConfig = getStorage();

const getCid = (cidOrIpfsUri: string) => cidOrIpfsUri.replace("ipfs://", "");
export const getNftStorageGatewayUri = (cidOrIpfsUri: string) => {
  const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
  return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
};

export const nftStorageClient = new NFTStorage({ token: storageConfig.nftStorage });
export const web3StorageClient = new Web3Storage({ token: storageConfig.web3Storage });

/**
 * Stores NFT metadata into NFT.storage
 * @param data
 * @param targetClient
 * @returns
 */
export const storeMetadata = async (data: HypercertMetadata): Promise<CIDString> => {
  console.log("Storing metadata: ", data);
  const client = nftStorageClient;
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const cid = await client.storeBlob(blob);
  return cid;
};

/**
 * Retrieves NFT metadata from NFT.storage
 * @param cidOrIpfsUri
 * @returns
 */
export const getMetadata = async (cidOrIpfsUri: string): Promise<HypercertMetadata> => {
  const nftStorageGatewayLink = getNftStorageGatewayUri(cidOrIpfsUri);
  console.log(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
  return axios.get<HypercertMetadata>(nftStorageGatewayLink).then((result) => result.data);
};

/**
 * Store arbitrary JSON data into web3.storage
 * - Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob
 * - Because we pay for storage quotas, this data is stored best effort.
 * - If you are using our default keys, we may delete older data if we hit our storage quota
 * @param data
 * @param targetClient
 * @returns
 */
export const storeData = async (data: any): Promise<CIDString> => {
  const client = web3StorageClient;
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const files = [new File([blob], "data.json")];
  console.log("Storing blob of: ", data);
  const cid = await client.put(files, { wrapWithDirectory: false });
  return cid;
};

/**
 * Get arbitrary data from web3.storage
 * @param cidOrIpfsUri
 * @returns
 */
export const getData = async (cidOrIpfsUri: string): Promise<any> => {
  const client = web3StorageClient;
  const cid = getCid(cidOrIpfsUri);

  // Get the data
  const res = await client.get(cid);
  if (!res.ok) {
    throw new FetchError(`Failed to get ${cidOrIpfsUri}`);
  }

  // Assert there's only 1 file
  // TODO: because we are storing with `wrapDirectory: false`, this call fails
  //  on upstream projects (e.g. frontend)
  //  which is confusing because there's no other way to retrieve the file
  //  doubly confusing because the unit tests work fine.
  //  Need further investigating, but using `getMetadata` works as a workaround atm
  const files = await res.files();
  if (files.length !== 1) {
    throw new MalformedDataError(`Expected 1 file but got ${files.length}`);
  }
  const dataStr = await files[0].text();
  const data = JSON.parse(dataStr);
  console.log(`Getting data ${cidOrIpfsUri}: `, data);
  return data;
};
