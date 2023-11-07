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
import fetchers from "./utils/fetchers";

/**
 * A class that provides storage functionality for Hypercerts.
 *
 * This class implements the `HypercertStorageInterface` and provides methods for storing and retrieving Hypercerts. It uses the NFT Storage and Web3 Storage APIs for storage, and can be configured to be read-only.
 *
 * @property {boolean} readonly - Whether the storage is read-only. If true, the storage methods will not perform any write operations.
 * @property {NFTStorage} nftStorageClient - The NFT Storage client used for storing and retrieving Hypercerts.
 * @property {Web3Storage} web3StorageClient - The Web3 Storage client used for storing and retrieving Hypercerts.
 *
 * @example
 * const storage = new HypercertsStorage({ nftStorageToken: 'your-nft-storage-token', web3StorageToken: 'your-web3-storage-token' });
 * const metadata = await storage.getMetadata('your-hypercert-id');
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
   *
   * This constructor takes an optional `overrides` parameter that can be used to override the default configuration. If the NFT Storage or Web3 Storage API keys are missing or invalid, the storage will be read-only.
   *
   * @param {Partial<HypercertStorageConfig>} overrides - The configuration overrides for the storage.
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

  /**
   * Stores Hypercert metadata using the NFT Storage client.
   *
   * This method first checks if the storage is read-only or if the NFT Storage client is not configured. If either of these conditions is true, it throws a `StorageError`.
   * It then validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`.
   * If the metadata is valid, it creates a new Blob from the metadata and stores it using the NFT Storage client. If the storage operation fails, it throws a `StorageError`.
   *
   * @param {HypercertMetadata} data - The Hypercert metadata to store. This should be an object that conforms to the HypercertMetadata type.
   * @returns {Promise<CIDString>} A promise that resolves to the CID of the stored metadata.
   * @throws {StorageError} Will throw a `StorageError` if the storage is read-only, if the NFT Storage client is not configured, or if the storage operation fails.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the provided metadata is invalid.
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
   * Retrieves Hypercert metadata from IPFS using the provided CID or IPFS URI.
   *
   * This method first retrieves the data from IPFS using the `getFromIPFS` function. It then validates the retrieved data using the `validateMetaData` function. If the data is invalid, it throws a `MalformedDataError`.
   * If the data is valid, it returns the data as a `HypercertMetadata` object.
   *
   * @param {string} cidOrIpfsUri - The CID or IPFS URI of the metadata to retrieve.
   * @returns {Promise<HypercertMetadata>} A promise that resolves to the retrieved metadata.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the retrieved data is invalid.
   */
  public async getMetadata(cidOrIpfsUri: string): Promise<HypercertMetadata> {
    const res = await fetchers.getFromIPFS(cidOrIpfsUri);

    const validation = validateMetaData(res);
    if (!validation.valid) {
      throw new MalformedDataError(`Invalid metadata at ${cidOrIpfsUri}`, { errors: validation.errors });
    }

    return validation.data as HypercertMetadata;
  }

  /**
   * Stores data using the Web3 Storage client.
   *
   * This method first checks if the storage is read-only or if the Web3 Storage client is not configured. If either of these conditions is true, it throws a `StorageError`.
   * It then creates a new Blob from the provided data and stores it using the Web3 Storage client. If the storage operation fails, it throws a `StorageError`.
   *
   * @param {unknown} data - The data to store. This can be any type of data.
   * @returns {Promise<CIDString>} A promise that resolves to the CID of the stored data.
   * @throws {StorageError} Will throw a `StorageError` if the storage is read-only, if the Web3 Storage client is not configured, or if the storage operation fails.
   *
   * @remarks Even though web3.storage takes a list of files, we'll assume we're only storing 1 JSON blob.
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
   * Retrieves data from IPFS using the provided CID or IPFS URI.
   *
   * This method first retrieves the data from IPFS using the `getFromIPFS` function. It then parses the retrieved data as JSON and returns it.
   *
   * @param {string} cidOrIpfsUri - The CID or IPFS URI of the data to retrieve.
   * @returns {Promise<any>} A promise that resolves to the retrieved data.
   * @throws {FetchError} Will throw a `FetchError` if the retrieval operation fails.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the retrieved data is not a single file.
   *
   * @remarkts Note: The original implementation using the Web3 Storage client is currently commented out due to issues with upstream repos. This will be replaced once those issues are resolved.
   */
  public async getData(cidOrIpfsUri: string): Promise<unknown> {
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
    return await fetchers.getFromIPFS(cidOrIpfsUri);
  }
}
