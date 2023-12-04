import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { Account, ByteArray, GetContractReturnType, Hex, PublicClient, WalletClient, getContract } from "viem";
import { HypercertEvaluator } from "./evaluations";
import { HypercertIndexer } from "./indexer";
import { HypercertsStorage } from "./storage";
import {
  AllowlistEntry,
  ClientError,
  HypercertClientConfig,
  HypercertClientInterface,
  HypercertMetadata,
  InvalidOrMissingError,
  MalformedDataError,
  SupportedOverrides,
  TransferRestrictions,
} from "./types";
import { getConfig } from "./utils/config";
import { validateAllowlist, validateMetaData, verifyMerkleProof, verifyMerkleProofs } from "./validator";
import { handleSimulatedContractError } from "./utils/errors";
import { logger } from "./utils";

/**
 * The `HypercertClient` is a core class in the hypercerts SDK, providing a high-level interface to interact with the hypercerts system.
 *
 * It encapsulates the logic for storage, evaluation, indexing, and wallet interactions, abstracting the complexity and providing a simple API for users.
 * The client is read-only if the storage is read-only (no nft.storage/web3.storage keys) or if no walletClient was found.
 *
 * @example
 * const config: Partial<HypercertClientConfig> = {
 *  chain: {id: 5},
 * };
 * const client = new HypercertClient(config);
 *
 * @param {Partial<HypercertClientConfig>} config - The configuration options for the client.
 */
export class HypercertClient implements HypercertClientInterface {
  readonly _config;
  private _storage: HypercertsStorage;
  // TODO better handling readonly. For now not needed since we don't use this class;
  private _evaluator?: HypercertEvaluator;
  private _indexer: HypercertIndexer;
  private _publicClient: PublicClient;
  private _walletClient?: WalletClient;
  readonly: boolean;

  /**
   * Creates a new instance of the `HypercertClient` class.
   *
   * This constructor takes a `config` parameter that is used to configure the client. The `config` parameter should be a `HypercertClientConfig` object. If the public client cannot be connected, it throws a `ClientError`.
   *
   * @param {Partial<HypercertClientConfig>} config - The configuration options for the client.
   * @throws {ClientError} Will throw a `ClientError` if the public client cannot be connected.
   */
  constructor(config: Partial<HypercertClientConfig>) {
    this._config = getConfig(config);
    if (!this._config.publicClient) {
      throw new ClientError("Could not connect to public client.");
    }

    this._publicClient = this._config.publicClient;
    this._walletClient = this._config?.walletClient;

    this._storage = new HypercertsStorage(this._config);

    this._indexer = new HypercertIndexer(this._config);

    this.readonly = this._config.readOnly || this._storage.readonly || !this._walletClient;

    if (this.readonly) {
      logger.warn("HypercertsClient is in readonly mode", "client");
    }
  }

  /**
   * Gets the config for the client.
   * @returns The client config.
   */
  get config(): Partial<HypercertClientConfig> {
    return this._config;
  }

  /**
   * Gets the storage layer for the client.
   * @returns The storage layer.
   */
  get storage(): HypercertsStorage {
    return this._storage;
  }

  /**
   * Gets the indexer for the client.
   * @returns The indexer.
   */
  get indexer(): HypercertIndexer {
    return this._indexer;
  }

  /**
   * Gets the HypercertMinter contract used by the client.
   * @returns The contract.
   */
  get contract(): GetContractReturnType<typeof HypercertMinterAbi> {
    return getContract({
      address: this._config.contractAddress as `0x${string}`,
      abi: HypercertMinterAbi,
      publicClient: this._publicClient,
      walletClient: this._walletClient,
    });
  }

  /**
   * Mints a new claim.
   *
   * This method first validates the provided metadata using the `validateMetaData` function. If the metadata is invalid, it throws a `MalformedDataError`.
   * It then stores the metadata on IPFS using the `storeMetadata` method of the storage client.
   * After that, it simulates a contract call to the `mintClaim` function with the provided parameters and the stored metadata CID to validate the transaction.
   * Finally, it submits the request using the `submitRequest` method.
   *
   * @param {HypercertMetadata} metaData - The metadata for the claim.
   * @param {bigint} totalUnits - The total units for the claim.
   * @param {TransferRestrictions} transferRestriction - The transfer restrictions for the claim.
   * @param {SupportedOverrides} [overrides] - Optional overrides for the contract call.
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the provided metadata is invalid.
   */
  mintClaim = async (
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    // validate metadata
    const { valid, errors } = validateMetaData(metaData);
    if (!valid && Object.keys(errors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", errors);
    }

    // store metadata on IPFS
    const cid = await this.storage.storeMetadata(metaData);

    const request = await this.simulateRequest(
      account,
      "mintClaim",
      [account?.address, totalUnits, cid, transferRestriction],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * Gets the TransferRestrictions for a claim.
   *
   * This method first retrieves the read contract using the `getContract` method. It then simulates a contract call to the `readTransferRestriction` function with the provided fraction ID.
   *
   * @param fractionId
   * @returns a Promise that resolves to the applicable transfer restrictions.
   */
  getTransferRestrictions = async (fractionId: bigint): Promise<TransferRestrictions> => {
    const readContract = getContract({
      ...this.getContractConfig(),
      publicClient: this._publicClient,
    });

    return readContract.read.readTransferRestriction([fractionId]) as Promise<TransferRestrictions>;
  };

  /**
   * Transfers a claim fraction to a new owner.
   *
   * This method first retrieves the wallet client and account using the `getWallet` method.
   * It then simulates a contract call to the `safeTransferFrom` function with the provided parameters and the account, and submits the request using the `submitRequest` method.
   *
   * @param fractionId
   * @param to
   * @param overrides
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   */
  transferFraction = async (
    fractionId: bigint,
    to: string,
    overrides?: SupportedOverrides | undefined,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    const request = await this.simulateRequest(
      account,
      "safeTransferFrom",
      [account?.address, to, fractionId, 1, "0x"],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * Transfers multiple claim fractions to a new owner.
   *
   * This method first retrieves the wallet client and account using the `getWallet` method.
   * It then simulates a contract call to the `safeBatchTransferFrom` function with the provided parameters and the account, and submits the request using the `submitRequest` method.
   *
   * @param fractionIds
   * @param to
   * @param overrides
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   */
  batchTransferFractions = async (
    fractionIds: bigint[],
    to: `0x${string}`,
    overrides?: SupportedOverrides | undefined,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    const request = await this.simulateRequest(
      account,
      "safeBatchTransferFrom",
      [account?.address, to, fractionIds, fractionIds.map(() => 1n), "0x"],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * Creates an allowlist.
   *
   * This method first validates the provided allowlist and metadata using the `validateAllowlist` and `validateMetaData` functions respectively. If either is invalid, it throws a `MalformedDataError`.
   * It then creates an allowlist from the provided entries and stores it on IPFS using the `storeData` method of the storage client.
   * After that, it stores the metadata (including the CID of the allowlist) on IPFS using the `storeMetadata` method of the storage client.
   * Finally, it simulates a contract call to the `createAllowlist` function with the provided parameters and the stored metadata CID, and submits the request using the `submitRequest` method.
   *
   * @param {AllowlistEntry[]} allowList - The entries for the allowlist.
   * @param {HypercertMetadata} metaData - The metadata for the claim.
   * @param {bigint} totalUnits - The total units for the claim.
   * @param {TransferRestrictions} transferRestriction - The transfer restrictions for the claim.
   * @param {SupportedOverrides} [overrides] - Optional overrides for the contract call.
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   * @throws {MalformedDataError} Will throw a `MalformedDataError` if the provided allowlist or metadata is invalid.
   */
  createAllowlist = async (
    allowList: AllowlistEntry[],
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    // validate allowlist
    const { valid: validAllowlist, errors: allowlistErrors } = validateAllowlist(allowList, totalUnits);
    if (!validAllowlist && Object.keys(allowlistErrors).length > 0) {
      throw new MalformedDataError("Allowlist validation failed", allowlistErrors);
    }

    // validate metadata
    const { valid: validMetaData, errors: metaDataErrors } = validateMetaData(metaData);
    if (!validMetaData && Object.keys(metaDataErrors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", metaDataErrors);
    }

    // create allowlist
    const tuples = allowList.map((p) => [p.address, p.units.toString()]);
    const tree = StandardMerkleTree.of(tuples, ["address", "uint256"]);
    const cidMerkle = await this.storage.storeData(JSON.stringify(tree.dump()));

    // store metadata on IPFS
    const cid = await this.storage.storeMetadata({ ...metaData, allowList: cidMerkle });

    const request = await this.simulateRequest(
      account,
      "createAllowlist",
      [account?.address, totalUnits, tree.root, cid, transferRestriction],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * Splits a fraction into multiple fractions.
   *
   * This method first retrieves the wallet client and account using the `getWallet` method. It then retrieves the owner and total units of the fraction using the `ownerOf` and `unitsOf` methods of the read contract.
   * If the fraction is not owned by the account, it throws a `ClientError`.
   * It then checks if the sum of the provided fractions is equal to the total units of the fraction. If not, it throws a `ClientError`.
   * Finally, it simulates a contract call to the `splitFraction` function with the provided parameters and the account, and submits the request using the `submitRequest` method.
   *
   * @param {bigint} fractionId - The ID of the fraction to split.
   * @param {bigint[]} fractions - The fractions to split the fraction into.
   * @param {SupportedOverrides} [overrides] - Optional overrides for the contract call.
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   * @throws {ClientError} Will throw a `ClientError` if the fraction is not owned by the account or if the sum of the fractions is not equal to the total units of the fraction.
   */
  splitFractionUnits = async (
    fractionId: bigint,
    fractions: bigint[],
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    const readContract = getContract({
      ...this.getContractConfig(),
      publicClient: this._publicClient,
    });

    const fractionOwner = (await readContract.read.ownerOf([fractionId])) as `0x${string}`;
    const totalUnits = (await readContract.read.unitsOf([fractionId])) as bigint;

    if (fractionOwner.toLowerCase() !== account?.address.toLowerCase())
      throw new ClientError("Claim is not owned by the signer", { signer: account?.address, fractionOwner });

    // check if the sum of the fractions is equal to the total units
    const sumFractions = fractions.reduce((a, b) => a + b, 0n);
    if (sumFractions != totalUnits)
      throw new ClientError("Sum of fractions is not equal to the total units", { totalUnits, sumFractions });

    const request = await this.simulateRequest(
      account,
      "splitFraction",
      [account?.address, fractionId, fractions],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * Merges multiple fractions into a single fraction.
   *
   * This method first retrieves the wallet client and account using the `getWallet` method. It then retrieves the owner of each fraction using the `ownerOf` method of the read contract.
   * If any of the fractions are not owned by the account, it throws a `ClientError`.
   * It then simulates a contract call to the `mergeFractions` function with the provided parameters and the account, and submits the request using the `submitRequest` method.
   *
   * @param {bigint[]} fractionIds - The IDs of the fractions to merge.
   * @param {SupportedOverrides} [overrides] - Optional overrides for the contract call.
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   * @throws {ClientError} Will throw a `ClientError` if any of the fractions are not owned by the account.
   */
  mergeFractionUnits = async (
    fractionIds: bigint[],
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    const readContract = getContract({
      ...this.getContractConfig(),
      publicClient: this._publicClient,
    });

    const fractions = await Promise.all(
      fractionIds.map(async (id) => ({ id, owner: (await readContract.read.ownerOf([id])) as `0x${string}` })),
    );

    const notOwned = fractions.filter((fraction) => fraction.owner.toLowerCase() !== account?.address.toLowerCase());

    if (notOwned.length > 0) {
      throw new ClientError("One or more fractions are not owned by the signer", {
        signer: account?.address,
        notOwned,
      });
    }

    const request = await this.simulateRequest(account, "mergeFractions", [account?.address, fractionIds], overrides);

    return this.submitRequest(request);
  };

  /**
   * Burns a claim fraction.
   *
   * This method first retrieves the wallet client and account using the `getWallet` method. It then retrieves the owner of the claim using the `ownerOf` method of the read contract.
   * If the claim is not owned by the account, it throws a `ClientError`.
   * It then simulates a contract call to the `burnFraction` function with the provided parameters and the account, and submits the request using the `submitRequest` method.
   *
   * @param {bigint} claimId - The ID of the claim to burn.
   * @param {SupportedOverrides} [overrides] - Optional overrides for the contract call.
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   * @throws {ClientError} Will throw a `ClientError` if the claim is not owned by the account.
   */
  burnClaimFraction = async (claimId: bigint, overrides?: SupportedOverrides): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    const readContract = getContract({
      ...this.getContractConfig(),
      publicClient: this._publicClient,
    });

    const claimOwner = (await readContract.read.ownerOf([claimId])) as `0x${string}`;

    if (claimOwner.toLowerCase() !== account?.address.toLowerCase()) {
      throw new ClientError("Claim is not owned by the signer", { signer: account?.address, claimOwner });
    }

    const request = await this.simulateRequest(account, "burnFraction", [account?.address, claimId], overrides);

    return this.submitRequest(request);
  };

  /**
   * Mints a claim fraction from an allowlist.
   *
   * This method first retrieves the wallet client and account using the `getWallet` method. It then verifies the provided proof using the `verifyMerkleProof` function. If the proof is invalid, it throws an `InvalidOrMissingError`.
   * It then simulates a contract call to the `mintClaimFromAllowlist` function with the provided parameters and the account, and submits the request using the `submitRequest` method.
   *
   * @param {bigint} claimId - The ID of the claim to mint.
   * @param {bigint} units - The units of the claim to mint.
   * @param {(Hex | ByteArray)[]} proof - The proof for the claim.
   * @param {Hex | ByteArray} [root] - The root of the proof. If provided, it is used to verify the proof.
   * @param {SupportedOverrides} [overrides] - Optional overrides for the contract call.
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   * @throws {InvalidOrMissingError} Will throw an `InvalidOrMissingError` if the proof is invalid.
   */
  mintClaimFractionFromAllowlist = async (
    claimId: bigint,
    units: bigint,
    proof: (Hex | ByteArray)[],
    root?: Hex | ByteArray,
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    //verify the proof using the OZ merkle tree library
    if (root && root.length > 0) {
      if (!account?.address) throw new InvalidOrMissingError("No wallet address found, are you connected?");
      verifyMerkleProof(
        root.toString(),
        account?.address,
        units,
        proof.map((p) => p.toString()),
      );
    }

    const request = await this.simulateRequest(
      account,
      "mintClaimFromAllowlist",
      [account?.address, proof, claimId, units],
      overrides,
    );

    return this.submitRequest(request);
  };

  /**
   * Mints multiple claim fractions from allowlists in a batch.
   *
   * This method first retrieves the wallet client and account using the `getWallet` method. If the roots are provided, it verifies each proof using the `verifyMerkleProofs` function. If any of the proofs are invalid, it throws an `InvalidOrMissingError`.
   * It then simulates a contract call to the `batchMintClaimsFromAllowlists` function with the provided parameters and the account, and submits the request using the `submitRequest` method.
   *
   * @param {bigint[]} claimIds - The IDs of the claims to mint.
   * @param {bigint[]} units - The units of each claim to mint.
   * @param {(Hex | ByteArray)[][]} proofs - The proofs for each claim.
   * @param {(Hex | ByteArray)[]} [roots] - The roots of each proof. If provided, they are used to verify the proofs.
   * @param {SupportedOverrides} [overrides] - Optional overrides for the contract call.
   * @returns {Promise<`0x${string}` | undefined>} A promise that resolves to the transaction hash.
   * @throws {InvalidOrMissingError} Will throw an `InvalidOrMissingError` if any of the proofs are invalid.
   */
  batchMintClaimFractionsFromAllowlists = async (
    claimIds: bigint[],
    units: bigint[],
    proofs: (Hex | ByteArray)[][],
    roots?: (Hex | ByteArray)[],
    overrides?: SupportedOverrides,
  ): Promise<`0x${string}` | undefined> => {
    const { account } = this.getWallet();

    //verify the proof using the OZ merkle tree library
    if (roots && roots.length > 0) {
      if (!account?.address) throw new InvalidOrMissingError("No wallet address found, are you connected?");

      verifyMerkleProofs(
        roots.map((r) => r.toString()),
        account?.address,
        units,
        proofs.map((p) => p.map((p) => p.toString())),
      );
    }

    const request = await this.simulateRequest(
      account,
      "batchMintClaimsFromAllowlists",
      [account?.address, proofs, claimIds, units],
      overrides,
    );

    return this.submitRequest(request);
  };

  private getContractConfig = () => {
    if (!this.config?.contractAddress) throw new ClientError("No contract address found", { config: this.config });

    return getContract({
      address: this.config.contractAddress as `0x${string}`,
      abi: HypercertMinterAbi,
    });
  };

  private getCleanedOverrides = (overrides?: SupportedOverrides) => {
    const _overrides = {
      value: overrides?.value,
      gas: overrides?.gasLimit,
      gasPrice: overrides?.gasPrice,
    };

    return Object.fromEntries(Object.entries(_overrides).filter(([_, value]) => value !== undefined));
  };

  private getWallet = () => {
    if (!this._walletClient) {
      throw new ClientError("Could not connect to wallet; sending transactions not allowed.", { client: this });
    }
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this._walletClient.account) throw new ClientError("No account found", { client: this });

    return { walletClient: this._walletClient, account: this._walletClient.account };
  };

  private simulateRequest = async (
    account: Account,
    functionName: string,
    args: unknown[],
    overrides?: SupportedOverrides,
  ) => {
    let _request;
    try {
      const { result, request } = await this._publicClient.simulateContract({
        functionName,
        account,
        args,
        ...this.getContractConfig(),
        ...this.getCleanedOverrides(overrides),
      });

      console.log("Result: ", result);
      _request = request;
    } catch (err) {
      handleSimulatedContractError(err);
    }

    return _request;
  };

  /**
   * Submits a contract request.
   *
   * This method submits a contract request using the `writeContract` method of the wallet client. If the request fails, it throws a `ClientError`.
   *
   * @param {any} request - The contract request to submit.
   * @returns {Promise<`0x${string}`>} A promise that resolves to the hash of the submitted request.
   * @throws {ClientError} Will throw a `ClientError` if the request fails.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private submitRequest = async (request: any) => {
    const hash = await this._walletClient?.writeContract(request);

    if (!hash) {
      throw new ClientError("Something went wrong when executing request", { request, hash });
    }

    return hash;
  };
}
