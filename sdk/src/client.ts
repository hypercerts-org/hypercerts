import { HypercertMinterAbi } from "@hypercerts-org/contracts";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import {
  ByteArray,
  GetContractReturnType,
  Hex,
  PublicClient,
  WalletClient,
  WriteContractReturnType,
  getContract,
  parseAbi,
} from "viem";
import HypercertEvaluator from "./evaluations/index";
import HypercertIndexer from "./indexer";
import HypercertsStorage from "./storage.js";
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
import logger from "./utils/logger";
import { validateAllowlist, validateMetaData, verifyMerkleProof, verifyMerkleProofs } from "./validator";

/**
 * Hypercerts client factory
 * @dev Creates a Hypercerts client instance
 * @notice The client is readonly if no signer is set or if the contract address is not set
 * @param config - Hypercerts client configuration
 * @param storage - Hypercerts storage object
 */
export default class HypercertClient implements HypercertClientInterface {
  readonly _config;
  private _storage: HypercertsStorage;
  // TODO better handling readonly. For now not needed since we don't use this class;
  private _evaluator: HypercertEvaluator | undefined;
  private _indexer: HypercertIndexer;
  //TODO added the TypedDataSigner since that's needed for EAS signing. Will this work on front-end?
  private _publicClient: PublicClient;
  private _walletClient: WalletClient | undefined;
  readonly: boolean;

  /**
   * Creates a new instance of the `HypercertClient` class.
   * @param config The configuration options for the client.
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

    this.readonly = this._config.readOnly || this._storage.readonly;

    this.readonly = !this._walletClient || this._storage.readonly;

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
  get contract(): GetContractReturnType {
    return getContract({
      address: this._config.contractAddress as `0x${string}`,
      abi: parseAbi(HypercertMinterAbi),
      publicClient: this._publicClient,
      walletClient: this._walletClient,
    });
  }

  /**
   * Mint a Hypercert claim
   * @dev Mints a Hypercert claim with the given metadata, total units and transfer restrictions
   * @param metaData - Hypercert metadata
   * @param totalUnits - Total number of units for the Hypercert
   * @param transferRestriction - Transfer restrictions for the Hypercert
   * @returns Contract transaction
   */
  mintClaim = async (
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    overrides?: SupportedOverrides,
  ): Promise<WriteContractReturnType> => {
    this.checkWritable();

    if (!this._walletClient) {
      throw new ClientError("Could not detect account; sending transactions not allowed.");
    }

    const operator = this._walletClient;

    // validate metadata
    const { valid, errors } = validateMetaData(metaData);
    if (!valid && Object.keys(errors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", errors);
    }

    // store metadata on IPFS
    const cid = await this.storage.storeMetadata(metaData);

    const { request } = await this._publicClient.simulateContract({
      functionName: "mintClaim",
      account: operator.account,
      args: [operator.account?.address, totalUnits, cid, transferRestriction],
      ...this.getContractConfig(),
      ...this.getCleanedOverrides(overrides),
    });

    return operator.writeContract(request);
  };

  /**
   * Create a Hypercert claim with an allowlist
   * @dev Mints a Hypercert claim with the given metadata, total units, transfer restrictions and allowlist
   * @notice The total number of units in the allowlist must match the total number of units for the Hypercert
   * @param allowList - Allowlist for the Hypercert
   * @param metaData  - Hypercert metadata
   * @param totalUnits - Total number of units for the Hypercert
   * @param transferRestriction - Transfer restrictions for the Hypercert
   * @returns Contract transaction
   */
  createAllowlist = async (
    allowList: AllowlistEntry[],
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    overrides?: SupportedOverrides,
  ) => {
    this.checkWritable();

    if (!this._walletClient) {
      throw new ClientError("Could not connect to wallet; sending transactions not allowed.");
    }

    const operator = this._walletClient;

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

    metaData.allowList = cidMerkle;

    // store metadata on IPFS
    const cid = await this.storage.storeMetadata(metaData);

    const { request } = await this._publicClient.simulateContract({
      functionName: "createAllowlist",
      account: operator.account,
      args: [operator.account?.address, totalUnits, tree.root, cid, transferRestriction],
      ...this.getContractConfig(),
      ...this.getCleanedOverrides(overrides),
    });

    return operator.writeContract(request);
  };

  /**
   * Split a Hypercert's unit into multiple claims with the given fractions
   * @dev Submit the ID of the claim to split and new fraction values.
   * @notice The sum of the fractions must be equal to the total units of the claim
   * @param fractionId - Hypercert claim id
   * @param newFractions - Fractions of the Hypercert claim to split
   * @returns Contract transaction
   */
  splitFractionUnits = async (fractionId: bigint, fractions: bigint[], overrides?: SupportedOverrides) => {
    this.checkWritable();

    if (!this._walletClient) {
      throw new ClientError("Could not connect to wallet; sending transactions not allowed.");
    }

    const operator = this._walletClient;

    const readContract = getContract({
      ...this.getContractConfig(),
      publicClient: this._publicClient,
    });

    const fractionOwner = await readContract.read.ownerOf([fractionId]);
    const totalUnits = (await readContract.read.unitsOf([fractionId])) as bigint;

    if ((fractionOwner as `0x${string}`).toLowerCase() !== operator.account?.address.toLowerCase())
      throw new ClientError("Claim is not owned by the signer", { signer: operator.account?.address, fractionOwner });

    // check if the sum of the fractions is equal to the total units
    const sumFractions = fractions.reduce((a, b) => a + b, 0n);
    if (sumFractions != totalUnits)
      throw new ClientError("Sum of fractions is not equal to the total units", { totalUnits, sumFractions });

    const { request } = await this._publicClient.simulateContract({
      functionName: "splitFraction",
      account: operator.account,
      args: [operator.account.address, fractionId, fractions],
      ...this.getContractConfig(),
      ...this.getCleanedOverrides(overrides),
    });

    return operator.writeContract(request);
  };

  /**
   * Merge multiple Hypercert claims fractions into one
   * @dev Merges multiple Hypercert claims into one
   * @param fractionIds - Hypercert claim ids
   * @returns Contract transaction
   */
  mergeFractionUnits = async (fractionIds: bigint[], overrides?: SupportedOverrides) => {
    this.checkWritable();

    if (!this._walletClient) {
      throw new ClientError("Could not connect to wallet; sending transactions not allowed.");
    }
    const operator = this._walletClient;

    const readContract = getContract({
      ...this.getContractConfig(),
      publicClient: this._publicClient,
    });

    const fractions = await Promise.all(
      fractionIds.map(async (id) => ({ id, owner: await readContract.read.ownerOf([id]) })),
    );
    if (fractions.some((c) => (c.owner as `0x${string}`).toLowerCase() !== operator.account?.address.toLowerCase())) {
      const invalidIds = fractions.filter((c) => c.owner !== operator.account?.address).map((c) => c.id);
      throw new ClientError("One or more claims are not owned by the signer", {
        signer: operator.account?.address,
        invalidIds,
      });
    }

    const { request } = await this._publicClient.simulateContract({
      functionName: "mergeFractions",
      account: operator.account,
      args: [operator.account?.address, fractionIds],
      ...this.getContractConfig(),
      ...this.getCleanedOverrides(overrides),
    });

    return operator.writeContract(request);
  };

  /**
   * Burn a Hypercert claim by providing the claim id
   * @dev Burns a Hypercert claim
   * @param fractionId - Hypercert claim id
   * @returns Contract transaction
   */
  burnClaimFraction = async (claimId: bigint, overrides?: SupportedOverrides) => {
    this.checkWritable();

    if (!this._walletClient) {
      throw new ClientError("Could not connect to wallet; sending transactions not allowed.");
    }

    const operator = this._walletClient;

    const readContract = getContract({
      ...this.getContractConfig(),
      publicClient: this._publicClient,
    });

    const claimOwner = await readContract.read.ownerOf([claimId]);

    if ((claimOwner as `0x${string}`).toLowerCase() !== operator.account?.address.toLowerCase()) {
      console.log("claimOwner", claimOwner);
      console.log("operator.account?.address", operator.account?.address);
      throw new ClientError("Claim is not owned by the signer", { signer: operator.account?.address, claimOwner });
    }

    const { request } = await this._publicClient.simulateContract({
      functionName: "burnFraction",
      account: operator.account?.address,
      args: [operator.account?.address, claimId],
      ...this.getContractConfig(),
      ...this.getCleanedOverrides(overrides),
    });

    return operator.writeContract(request);
  };

  /**
   * Mint a Hypercert claim fraction from an allowlist.
   * @dev Verifies the claim proof and mints the claim fraction
   * @notice If known, provide the root for client side verification
   * @param claimId - Hypercert claim id
   * @param units - Number of units to mint
   * @param proof - Merkle proof for the claim
   * @returns Contract transaction
   */
  mintClaimFractionFromAllowlist = async (
    claimId: bigint,
    units: bigint,
    proof: (Hex | ByteArray)[],
    root?: Hex | ByteArray,
    overrides?: SupportedOverrides,
  ) => {
    this.checkWritable();

    if (!this._walletClient) {
      throw new ClientError("Could not connect to wallet; sending transactions not allowed.");
    }

    const operator = this._walletClient;

    //verify the proof using the OZ merkle tree library
    if (root && root.length > 0) {
      if (!operator.account?.address) throw new InvalidOrMissingError("No wallet address found, are you connected?");
      verifyMerkleProof(
        root.toString(),
        operator.account?.address,
        units,
        proof.map((p) => p.toString()),
      );
    }

    const { request } = await this._publicClient.simulateContract({
      functionName: "mintClaimFromAllowlist",
      account: operator.account,
      args: [operator.account?.address, proof, claimId, units],
      ...this.getContractConfig(),
      ...this.getCleanedOverrides(overrides),
    });

    return operator.writeContract(request);
  };

  /**
   * Batch mints a claim fraction from an allowlist
   * @param claimIds Array of the IDs of the claims to mint fractions for.
   * @param units Array of the number of units for each fraction.
   * @param proofs Array of Merkle proofs for the allowlists.
   * @returns A Promise that resolves to the transaction receipt
   * @note The length of the arrays must be equal.
   * @note The order of the arrays must be equal.
   * @returns A Promise that resolves to the transaction receipt
   */
  batchMintClaimFractionsFromAllowlists = async (
    claimIds: bigint[],
    units: bigint[],
    proofs: (Hex | ByteArray)[][],
    roots?: (Hex | ByteArray)[],
    overrides?: SupportedOverrides,
  ) => {
    this.checkWritable();

    if (!this._walletClient) {
      throw new ClientError("Could not connect to wallet; sending transactions not allowed.");
    }

    const operator = this._walletClient;

    //verify the proof using the OZ merkle tree library
    if (roots && roots.length > 0) {
      if (!operator.account?.address) throw new InvalidOrMissingError("No wallet address found, are you connected?");

      verifyMerkleProofs(
        roots.map((r) => r.toString()),
        operator.account?.address,
        units,
        proofs.map((p) => p.map((p) => p.toString())),
      );
    }

    const { request } = await this._publicClient.simulateContract({
      functionName: "batchMintClaimsFromAllowlists",
      account: operator.account,
      args: [operator.account?.address, proofs, claimIds, units],
      ...this.getContractConfig(),
      ...this.getCleanedOverrides(overrides),
    });

    return operator.writeContract(request);
  };

  private getContractConfig = () => {
    return getContract({
      address: this.config.contractAddress as `0x${string}`,
      abi: parseAbi(HypercertMinterAbi),
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

  private checkWritable = () => {
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });

    return true;
  };
}
