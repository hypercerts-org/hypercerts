// @ts-ignore
import { NFTStorage, CIDString, Blob } from "nft.storage";
import { HypercertMetadata } from "../types/metadata.js";
import axios from "axios";

// NFT.Storage
const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN ?? "MISSING_TOKEN";

export const getIpfsGatewayUri = (cidOrIpfsUri: string) => {
  const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
  const cid = cidOrIpfsUri.replace("ipfs://", "");
  return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", cid);
};

const defaultNftStorageClient = new NFTStorage({ token: NFT_STORAGE_TOKEN });

export const storeMetadata = async (data: HypercertMetadata, targetClient?: NFTStorage): Promise<CIDString> => {
  console.log("Storing metadata: ", data);
  const client = targetClient ?? defaultNftStorageClient;

  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

  return await client.storeBlob(blob);
};

//TODO handle returned errors from gateway
export const getMetadata = async (cidOrIpfsUri: string): Promise<HypercertMetadata | null> => {
  const nftStorageGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);
  console.log(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);

  return axios
    .get<HypercertMetadata>(nftStorageGatewayLink)
    .then((result) => result.data)
    .catch((err) => {
      console.error(err);
      return null;
    });
};

export const storeData = async (data: any, targetClient?: NFTStorage): Promise<CIDString> => {
  const client = targetClient ?? defaultNftStorageClient;

  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  console.log("Storing blob of: ", data);

  return await client.storeBlob(blob);
};

//TODO risky method?
export const getData = async (cidOrIpfsUri: string) => {
  const nftStorageGatewayLink = getIpfsGatewayUri(cidOrIpfsUri);
  console.log(`Getting  data ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
  return axios
    .get(nftStorageGatewayLink)
    .then((result) => result.data)
    .catch((err) => {
      console.error(err);
      return null;
    });
};

export const deleteMetadata = async (cid: string, targetClient?: NFTStorage) => {
  console.log(`Deleting metadata: ${cid}`);
  const client = targetClient ?? defaultNftStorageClient;
  return client.delete(cid);
};
