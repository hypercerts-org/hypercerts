import axios from "axios";
// @ts-ignore
import { CIDString, NFTStorage } from "nft.storage";
// @ts-ignore
import { Blob, File, Web3Storage } from "web3.storage";

import { HypercertMetadata } from "../types/metadata.js";
import { logger } from "../utils/logger.js";

const getCid = (cidOrIpfsUri: string) => cidOrIpfsUri.replace("ipfs://", "");

type HypercertStorageProps = {
  nftStorageToken?: string;
  web3StorageToken?: string;
};

export default class HypercertsStorage {
  nftStorageClient: NFTStorage;
  web3StorageClient: Web3Storage;

  constructor({ nftStorageToken, web3StorageToken }: HypercertStorageProps) {
    const _nftStorageToken =
      nftStorageToken ?? process.env.NFT_STORAGE_TOKEN ?? process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    const _web3StorageToken =
      web3StorageToken ?? process.env.WEB3_STORAGE_TOKEN ?? process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

    if (!_nftStorageToken || !_web3StorageToken || _nftStorageToken === "" || _web3StorageToken === "") {
      throw new Error("Invalid API key");
    }
    this.nftStorageClient = new NFTStorage({ token: _nftStorageToken! });
    this.web3StorageClient = new Web3Storage({ token: _web3StorageToken! });
  }

  /**
   * Stores NFT metadata into NFT.storage
   * @param data
   * @param targetClient
   * @returns
   */
  public async storeMetadata(data: HypercertMetadata): Promise<CIDString> {
    logger.info("Storing HypercertMetaData:", { metadata: data });
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    return this.nftStorageClient.storeBlob(blob);
  }

  /**
   * Retrieves NFT metadata from NFT.storage
   * @param cidOrIpfsUri
   * @returns
   */
  public async getMetadata(cidOrIpfsUri: string) {
    const nftStorageGatewayLink = this.getNftStorageGatewayUri(cidOrIpfsUri);
    logger.info(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
    return axios.get<HypercertMetadata>(nftStorageGatewayLink).then(result => result.data);
  }

  /**
   * Store arbitrary JSON data into web3.storage
   * - Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob
   * - Because we pay for storage quotas, this data is stored best effort.
   * - If you are using our default keys, we may delete older data if we hit our storage quota
   * @param data
   * @param targetClient
   * @returns
   */
  public async storeData(data: any): Promise<CIDString> {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const files = [new File([blob], "data.json")];
    logger.info("Storing blob of: ", data);
    return await this.web3StorageClient.put(files, { wrapWithDirectory: false });
  }

  /**
   * Get arbitrary data from web3.storage
   * @param cidOrIpfsUri
   * @returns
   */
  public async getData(cidOrIpfsUri: string) {
    /**
    // Using the default web3.storage client is not working in upstream repos. Needs further testing.
    const cid = getCid(cidOrIpfsUri);

    // Get the data
    const res = await this.web3StorageClient.get(cid);
    if (!res || !res.ok) {
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
    */

    // TODO: replace current temporary fix of just using NFT.Storage IPFS gateway
    const nftStorageGatewayLink = this.getNftStorageGatewayUri(cidOrIpfsUri);
    logger.info(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);
    return axios.get(nftStorageGatewayLink).then((result: any) => result.data);
  }

  getNftStorageGatewayUri = (cidOrIpfsUri: string) => {
    const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
    return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
  };
}
