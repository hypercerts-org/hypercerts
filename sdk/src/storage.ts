import axios from "axios";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString, NFTStorage } from "nft.storage";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Blob, File, Web3Storage } from "web3.storage";

import { validateMetaData } from "./validator";
import {
  HypercertStorageConfig,
  HypercertStorageInterface,
  HypercertMetadata,
  MalformedDataError,
  StorageError,
} from "./types";
import logger from "./utils/logger";
import { getNftStorageToken, getWeb3StorageToken } from "./utils/config";

const getCid = (cidOrIpfsUri: string) => cidOrIpfsUri.replace("ipfs://", "");

/**
 * A class that provides storage functionality for Hypercerts.
 */
export default class HypercertsStorage implements HypercertStorageInterface {
  /** Whether the storage is read-only. */
  readonly: boolean = true;
  /** The NFT storage client. */
  nftStorageClient?: NFTStorage;
  /** The Web3 storage client. */
  web3StorageClient?: Web3Storage;

  /**
   * Creates a new instance of the `HypercertsStorage` class.
   * @param overrides The configuration overrides for the storage.
   */
  constructor(overrides: Partial<HypercertStorageConfig>) {
    const nftStorageToken = getNftStorageToken(overrides);
    const web3StorageToken = getWeb3StorageToken(overrides);

    if (!nftStorageToken || !web3StorageToken) {
      logger.warn("HypercertsStorage is read only", "storage");
      this.readonly = true;

      if (!nftStorageToken) {
        logger.warn(`NFT Storage API key is missing or invalid: ${nftStorageToken}}`);
      }

      if (!web3StorageToken) {
        logger.warn(`Web3 Storage API key is missing or invalid: ${web3StorageToken}`);
      }
    } else {
      this.nftStorageClient = new NFTStorage({ token: nftStorageToken.nftStorageToken || "" });
      this.web3StorageClient = new Web3Storage({ token: web3StorageToken.web3StorageToken || "" });
      this.readonly = false;
    }
  }

  getFromIPFS = async (cidOrIpfsUri: string, timeout = 10000) => {
    const nftStorageGatewayLink = this.getNftStorageGatewayUri(cidOrIpfsUri);
    const web3StorageGatewayLink = this.getWeb3StorageGatewayUri(cidOrIpfsUri);
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

  /**
   * Stores metadata for a Hypercert.
   * @param data The metadata to store.
   * @returns A Promise that resolves to the CID of the stored metadata.
   * @throws A `StorageError` if the storage client is not configured.
   * @throws A `MalformedDataError` if the metadata is invalid.
   * @notice Because we pay for storage quotas, this data is stored best effort.
   * If you are using our default keys, we may delete older data if we hit our storage quota.
   */
  public async storeMetadata(data: HypercertMetadata): Promise<CIDString> {
    if (this.readonly || !this.nftStorageClient) {
      throw new StorageError("NFT.storage client is not configured");
    }

    const validation = validateMetaData(data);
    if (!validation.valid) {
      throw new MalformedDataError(`Invalid metadata.`, { errors: validation.errors });
    }

    logger.debug("Storing HypercertMetaData: ", "storage", [data]);
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

    const cid: CIDString = await this.nftStorageClient.storeBlob(blob);
    if (!cid) {
      throw new StorageError("Failed to store metadata");
    }

    logger.debug(`Stored metadata at ${cid}`);

    return cid;
  }

  /**
   * Gets metadata for a Hypercert.
   * @param cidOrIpfsUri The CID or IPFS URI of the metadata to get.
   * @returns A Promise that resolves to the metadata.
   * @throws A `StorageError` if the storage client is not configured or the metadata cannot be retrieved.
   * @throws A `MalformedDataError` if the metadata is invalid. E.g. unknown schema
   */
  public async getMetadata(cidOrIpfsUri: string): Promise<HypercertMetadata> {
    const res = await this.getFromIPFS(cidOrIpfsUri);

    const validation = validateMetaData(res);
    if (!validation.valid) {
      throw new MalformedDataError(`Invalid metadata at ${cidOrIpfsUri}`, { errors: validation.errors });
    }

    return res;
  }

  /**
   * Stores arbitrary data in Web3 storage.
   * @param data The data to store.
   * @returns A Promise that resolves to the CID of the stored data.
   * @throws A `StorageError` if the storage client is not configured.
   * @notice Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob.
   * Because we pay for storage quotas, this data is stored best effort.
   * If you are using our default keys, we may delete older data if we hit our storage quota.
   */
  public async storeData(data: unknown): Promise<CIDString> {
    if (this.readonly || !this.web3StorageClient) {
      throw new StorageError("Web3.storage client is not configured");
    }
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const files = [new File([blob], "data.json")];
    logger.debug("Storing blob of: ", "storage", [data]);
    const cid: CIDString = await this.web3StorageClient.put(files, { wrapWithDirectory: false });

    if (!cid) {
      throw new StorageError("Failed to store data");
    }

    return cid;
  }

  /**
   * Gets arbitrary data from Web3 storage.
   * @param cidOrIpfsUri The CID or IPFS URI of the data to get.
   * @returns A Promise that resolves to the data.
   * @throws A `StorageError` if the storage client is not configured or the data cannot be retrieved.
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
    const res = await this.getFromIPFS(cidOrIpfsUri);

    return res;
  }

  getNftStorageGatewayUri = (cidOrIpfsUri: string) => {
    const NFT_STORAGE_IPFS_GATEWAY = "https://nftstorage.link/ipfs/{cid}";
    return NFT_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
  };

  getWeb3StorageGatewayUri = (cidOrIpfsUri: string) => {
    const WEB3_STORAGE_IPFS_GATEWAY = "https://w3s.link/ipfs/{cid}";
    return WEB3_STORAGE_IPFS_GATEWAY.replace("{cid}", getCid(cidOrIpfsUri));
  };
}
