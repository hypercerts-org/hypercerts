import axios from "axios";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString, NFTStorage } from "nft.storage";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Blob, File, Web3Storage } from "web3.storage";

import { HypercertStorageInterface, HypercertStorageConfig } from "../types/client.js";
import { InvalidOrMissingError, StorageError } from "../types/errors.js";
import { HypercertMetadata } from "../types/metadata.js";
import logger from "../utils/logger.js";

const getCid = (cidOrIpfsUri: string) => cidOrIpfsUri.replace("ipfs://", "");

/**
 * HypercertsStorage is a wrapper around NFT.storage and web3.storage
 * @deprecated refactored into storage.ts that doesn't throw but enables read only
 */
export default class HypercertsStorage implements HypercertStorageInterface {
  nftStorageClient: NFTStorage;
  web3StorageClient: Web3Storage;

  constructor({ nftStorageToken, web3StorageToken }: HypercertStorageConfig) {
    const _nftStorageToken =
      nftStorageToken ?? process.env.NFT_STORAGE_TOKEN ?? process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    const _web3StorageToken =
      web3StorageToken ?? process.env.WEB3_STORAGE_TOKEN ?? process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

    if (!_nftStorageToken || _nftStorageToken === "") {
      throw new InvalidOrMissingError("NFT Storage API key is missing or invalid.", "_nftStorageToken");
    }

    if (!_web3StorageToken || _web3StorageToken === "") {
      throw new InvalidOrMissingError("Web3 Storage API key is missing or invalid.", "_web3StorageToken");
    }

    this.nftStorageClient = new NFTStorage({ token: _nftStorageToken });
    this.web3StorageClient = new Web3Storage({ token: _web3StorageToken });
  }

  /**
   * Stores NFT metadata into NFT.storage
   * @param data
   * @param targetClient
   * @returns
   */
  public async storeMetadata(data: HypercertMetadata): Promise<CIDString> {
    logger.info("Storing HypercertMetaData:", "storage", [data]);
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

    const cid: CIDString = await this.nftStorageClient.storeBlob(blob);
    if (!cid) {
      throw new StorageError("Failed to store metadata");
    }

    return cid;
  }

  /**
   * Retrieves NFT metadata from NFT.storage
   * @param cidOrIpfsUri
   * @returns
   */
  public async getMetadata(cidOrIpfsUri: string): Promise<HypercertMetadata> {
    const nftStorageGatewayLink = this.getNftStorageGatewayUri(cidOrIpfsUri);
    console.log(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);

    return axios.get<HypercertMetadata>(nftStorageGatewayLink).then((result) => result.data);
  }

  /**
   * Store arbitrary JSON data into web3.storage
   * - Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob
   * - Because we pay for storage quotas, this data is stored best effort.
   * - If you are using our default keys, we may delete older data if we hit our storage quota
   * TODO: replace with w3up
   *
   * @param data
   * @param targetClient
   * @returns
   */
  public async storeData(data: unknown): Promise<CIDString> {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const files = [new File([blob], "data.json")];
    console.log("Storing blob of: ", data);
    const cid: CIDString = await this.web3StorageClient.put(files, { wrapWithDirectory: false });

    if (!cid) {
      throw new StorageError("Failed to store data");
    }

    return cid;
  }

  /**
   * Get arbitrary data from web3.storage. Use with caution because there's no guarantee that the data will be there or safe.
   * Note: confirmed with daghouse that we should use w3link to retrieve blobs
   *
   * @param cidOrIpfsUri
   * @returns JSON data or error
   */
  public async getData(cidOrIpfsUri: string) {
    const ipfsUri = this.getNftStorageGatewayUri(cidOrIpfsUri);
    console.log(`Getting data ${cidOrIpfsUri} at ${ipfsUri}`);

    return axios.get(ipfsUri).then((result) => result.data);
  }

  getNftStorageGatewayUri = (cidOrIpfsUri: string) => {
    const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
    return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
  };

  getW3linkGatewayUri = (cidOrIpfsUri: string) => {
    const GATEWAY_URI = "https://w3s.link/ipfs/{cid}";
    return GATEWAY_URI.replace("{cid}", getCid(cidOrIpfsUri));
  };
}
