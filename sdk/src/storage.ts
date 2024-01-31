import { validateAllowlist, validateMetaData } from "./validator";
import {
  HypercertStorageInterface,
  HypercertMetadata,
  MalformedDataError,
  StorageError,
  AllowlistEntry,
  StorageConfigOverrides,
} from "./types";
import { logger, getFromIPFS, parseAllowListEntriesToMerkleTree } from "./utils";
import { uploadAllowlist, uploadMetadata } from "./utils/apis";

/**
 * A class that provides storage functionality for Hypercerts.
 *
 * This class implements the `HypercertStorageInterface` and provides methods for storing and retrieving Hypercerts.
 *
 * @example
 * const storage = new HypercertsStorage();
 * const metadata = await storage.getMetadata('your-hypercert-id');
 */
export class HypercertsStorage implements HypercertStorageInterface {
  /**
   * Stores hypercerts allowlist on IPFS.
   *
   * First it validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`.
   * If the metadata is valid, it creates a new Blob from the metadata and stores it using the hypercerts API. If the storage operation fails, it throws a `StorageError`.
   *
   * @param {AllowlistEntry[]} allowList - The allowList to store.
   * @param {bigin} totalUnits - The total number of units in the allowlist.
   * @param {StorageConfigOverrides} [config] - An optional configuration object.
   * @returns {Promise<string>} A promise that resolves to the CID of the stored metadata.
   * @throws {StorageError} Will throw a `StorageError` if the storage operation fails.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the provided metadata is invalid.
   */
  public async storeAllowList(
    allowList: AllowlistEntry[],
    totalUnits: bigint,
    config: StorageConfigOverrides = { timeout: 0 },
  ): Promise<string> {
    const { valid, data, errors: allowlistErrors } = validateAllowlist(allowList, totalUnits);
    if (!valid) {
      throw new MalformedDataError(`Invalid allowList.`, { errors: allowlistErrors });
    }

    logger.debug("Storing allowlist: ", "storage", [data]);

    const tree = parseAllowListEntriesToMerkleTree(allowList);

    logger.debug("Allowlist tree: ", "storage", [tree]);

    const { data: resData, errors: uploadAllowlistErrors } = await uploadAllowlist(
      {
        allowList: JSON.stringify(tree.dump()),
        totalUnits: totalUnits.toString(),
      },
      config,
    );

    const allowlistCID = resData?.cid;

    if ((uploadAllowlistErrors && Object.keys(uploadAllowlistErrors).length > 0) || !allowlistCID) {
      throw new StorageError(`Allowlist upload failed.`, { errors: uploadAllowlistErrors, allowlistCID });
    }

    logger.debug(`Stored metadata at ${allowlistCID}`);

    return allowlistCID;
  }

  /**
   * Stores Hypercert metadata using the hypercerts API.
   *
   * It then validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`.
   * If the metadata is valid, it creates a new Blob from the metadata and stores it using the hypercerts API. If the storage operation fails, it throws a `StorageError`.
   *
   * @param {HypercertMetadata} data - The Hypercert metadata to store. This should be an object that conforms to the HypercertMetadata type.
   * @param {StorageConfigOverrides} [config] - An optional configuration object.
   * @returns {Promise<string>} A promise that resolves to the CID of the stored metadata.
   * @throws {StorageError} Will throw a `StorageError` if the storage operation fails.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the provided metadata is invalid.
   */
  public async storeMetadata(
    metadata: HypercertMetadata,
    config: StorageConfigOverrides = { timeout: 0 },
  ): Promise<string> {
    const { data, valid, errors: validationErrors } = validateMetaData(metadata);
    if (!valid) {
      throw new MalformedDataError(`Invalid metadata.`, { errors: validationErrors });
    }

    logger.debug("Storing HypercertMetaData: ", "storage", [data]);

    const { errors, data: resData } = await uploadMetadata(metadata, config);

    const cid = resData?.cid;

    if (!cid || (errors && Object.keys(errors).length > 0)) {
      throw new StorageError("Failed to store metadata", { errors, cid });
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
   * @param {StorageConfigOverrides} [config] - An optional configuration object.
   * @returns {Promise<HypercertMetadata>} A promise that resolves to the retrieved metadata.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the retrieved data is invalid.
   */
  public async getMetadata(
    cidOrIpfsUri: string,
    config: StorageConfigOverrides = { timeout: 0 },
  ): Promise<HypercertMetadata> {
    const res = await getFromIPFS(cidOrIpfsUri, config.timeout);

    const validation = validateMetaData(res);
    if (!validation.valid) {
      throw new MalformedDataError(`Invalid metadata at ${cidOrIpfsUri}`, { errors: validation.errors });
    }

    return validation.data as HypercertMetadata;
  }

  /**
   * Retrieves data from IPFS using the provided CID or IPFS URI.
   *
   * This method first retrieves the data from IPFS using the `getFromIPFS` function. It then parses the retrieved data as JSON and returns it.
   *
   * @param {string} cidOrIpfsUri - The CID or IPFS URI of the data to retrieve.
   * @param {StorageConfigOverrides} [config] - An optional configuration object.
   * @returns {Promise<any>} A promise that resolves to the retrieved data.
   * @throws {FetchError} Will throw a `FetchError` if the retrieval operation fails.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the retrieved data is not a single file.
   *
   * @remarkts Note: The original implementation using the Web3 Storage client is currently commented out due to issues with upstream repos. This will be replaced once those issues are resolved.
   */
  public async getData(cidOrIpfsUri: string, config: StorageConfigOverrides = { timeout: 0 }): Promise<unknown> {
    return await getFromIPFS(cidOrIpfsUri, config.timeout);
  }
}
