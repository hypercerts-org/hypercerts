import axios from "axios";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString, NFTStorage } from "nft.storage";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Blob, File, Web3Storage } from "web3.storage";

import { validateMetaData } from "./index.js";
import { HypercertStorageInterface, HypercertStorageProps } from "./types/client.js";
import { MalformedDataError, StorageError } from "./types/errors.js";
import { HypercertMetadata } from "./types/metadata.js";
import { logger } from "./utils/logger.js";

const getCid = (cidOrIpfsUri: string) => cidOrIpfsUri.replace("ipfs://", "");

/**
 * Client wrapper for Web3.storage and NFT.storage
 */
export default class HypercertsStorage implements HypercertStorageInterface {
  readonly: boolean = true;
  nftStorageClient?: NFTStorage;
  web3StorageClient?: Web3Storage;

  constructor({ nftStorageToken, web3StorageToken }: HypercertStorageProps) {
    const _nftStorageToken =
      nftStorageToken ?? process.env.NFT_STORAGE_TOKEN ?? process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;
    const _web3StorageToken =
      web3StorageToken ?? process.env.WEB3_STORAGE_TOKEN ?? process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN;

    if (!_nftStorageToken || _nftStorageToken === "") {
      logger.error(`NFT Storage API key is missing or invalid: ${_nftStorageToken}}`);
    }

    if (!_web3StorageToken || _web3StorageToken === "") {
      logger.error(`Web3 Storage API key is missing or invalid: ${_web3StorageToken}`);
    }

    if (_nftStorageToken !== undefined && _web3StorageToken !== undefined) {
      this.nftStorageClient = new NFTStorage({ token: _nftStorageToken });
      this.web3StorageClient = new Web3Storage({ token: _web3StorageToken });
      this.readonly = false;
    } else {
      logger.warn("Storage is read only");
    }
  }

  /**
   * Stores NFT metadata into NFT.storage
   * @param data
   * @param targetClient
   * @returns
   */
  public async storeMetadata(data: HypercertMetadata): Promise<CIDString> {
    if (this.readonly || !this.nftStorageClient) {
      throw new StorageError("NFT.storage client is not configured");
    }

    const validation = validateMetaData(data);
    if (!validation.valid) {
      throw new MalformedDataError(`Invalid metadata.`, { errors: validation.errors });
    }

    logger.debug("Storing HypercertMetaData:", { metadata: data });
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

    const cid: CIDString = await this.nftStorageClient.storeBlob(blob);
    if (!cid) {
      throw new StorageError("Failed to store metadata");
    }

    logger.debug(`Stored metadata at ${cid}`);

    return cid;
  }

  /**
   * Retrieves NFT metadata from NFT.storage
   * @param cidOrIpfsUri
   * @returns
   */
  public async getMetadata(cidOrIpfsUri: string): Promise<HypercertMetadata> {
    const nftStorageGatewayLink = this.getNftStorageGatewayUri(cidOrIpfsUri);
    logger.debug(`Getting metadata ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);

    const res = await axios.get<HypercertMetadata>(nftStorageGatewayLink);

    if (!res || !res.data) {
      throw new StorageError(`Failed to get ${cidOrIpfsUri}`);
    }

    const data = res.data;
    const validation = validateMetaData(data);
    if (!validation.valid) {
      throw new MalformedDataError(`Invalid metadata at ${cidOrIpfsUri}`, { errors: validation.errors });
    }

    return data;
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
  public async storeData(data: unknown): Promise<CIDString> {
    if (this.readonly || !this.web3StorageClient) {
      throw new StorageError("Web3.storage client is not configured");
    }
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const files = [new File([blob], "data.json")];
    logger.debug("Storing blob of: ", data);
    const cid: CIDString = await this.web3StorageClient.put(files, { wrapWithDirectory: false });

    if (!cid) {
      throw new StorageError("Failed to store data");
    }

    return cid;
  }

  /**
   * Get arbitrary data from web3.storage. Use with caution because there's no guarantee that the data will be there or safe.
   * @param cidOrIpfsUri
   * @returns JSON data or error
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
    logger.info(`Getting data ${cidOrIpfsUri} at ${nftStorageGatewayLink}`);

    return axios.get(nftStorageGatewayLink).then((result) => result.data);
  }

  getNftStorageGatewayUri = (cidOrIpfsUri: string) => {
    const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
    return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
  };
}
