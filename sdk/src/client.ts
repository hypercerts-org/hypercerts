import { HypercertMinter, HypercertMinterFactory } from "@hypercerts-org/contracts";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { BigNumber, BigNumberish, BytesLike, ContractTransaction, ethers, providers } from "ethers";

import { DEFAULT_CHAIN_ID } from "./constants.js";
import HypercertEvaluator from "./evaluations/index.js";
import HypercertIndexer from "./indexer.js";
import HypercertsStorage from "./storage.js";
import {
  AllowlistEntry,
  ClientError,
  HypercertClientConfig,
  HypercertClientInterface,
  HypercertMetadata,
  InvalidOrMissingError,
  MalformedDataError,
  TransferRestrictions,
} from "./types/index.js";
import { getConfig } from "./utils/config.js";
import logger from "./utils/logger.js";
import { validateAllowlist, validateMetaData, verifyMerkleProof, verifyMerkleProofs } from "./validator/index.js";

/**
 * Hypercerts client factory
 * @dev Creates a Hypercerts client instance
 * @notice The client is readonly if no signer is set or if the contract address is not set
 * @param config - Hypercerts client configuration
 * @param storage - Hypercerts storage object
 */
export default class HypercertClient implements HypercertClientInterface {
  readonly _config: HypercertClientConfig;
  private _storage: HypercertsStorage;
  private _evaluator: HypercertEvaluator;
  private _indexer: HypercertIndexer;
  //TODO added the TypedDataSigner since that's needed for EAS signing. Will this work on front-end?
  private _operator: ethers.providers.Provider | ethers.Signer;
  private _contract: HypercertMinter;
  readonly: boolean;

  /**
   * Creates a new instance of the `HypercertClient` class.
   * @param config The configuration options for the client.
   */
  constructor(config = { chainId: DEFAULT_CHAIN_ID } as Partial<HypercertClientConfig>) {
    this._config = getConfig(config);
    this._operator = this._config.operator;

    this._contract = HypercertMinterFactory.connect(this._config.contractAddress, this._operator);

    this._storage = new HypercertsStorage(this._config);

    this._indexer = new HypercertIndexer(this._config);

    this._evaluator = new HypercertEvaluator(this._config);

    this.readonly =
      this._operator instanceof providers.Provider ||
      !this._operator._isSigner ||
      !this._contract.address ||
      this._storage.readonly;

    if (this.readonly) {
      logger.warn("HypercertsClient is in readonly mode", "client");
    }
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
  get contract(): HypercertMinter {
    return this._contract;
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
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
    overrides?: ethers.Overrides,
  ): Promise<ContractTransaction> => {
    this.checkWritable();

    if (!(this._config.operator instanceof ethers.Signer)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();

    // validate metadata
    const { valid, errors } = validateMetaData(metaData);
    if (!valid && Object.keys(errors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", errors);
    }

    // store metadata on IPFS
    const cid = await this.storage.storeMetadata(metaData);

    return overrides
      ? this.contract.mintClaim(signerAddress, totalUnits, cid, transferRestriction, overrides)
      : this.contract.mintClaim(signerAddress, totalUnits, cid, transferRestriction);
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
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
    overrides?: ethers.Overrides,
  ) => {
    this.checkWritable();

    if (!(this._config.operator instanceof ethers.Signer)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();

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
    const tuples = allowList.map((p) => [p.address, p.units]);
    const tree = StandardMerkleTree.of(tuples, ["address", "uint256"]);
    const cidMerkle = await this.storage.storeData(JSON.stringify(tree.dump()));

    metaData.allowList = cidMerkle;

    // store metadata on IPFS
    const cid = await this.storage.storeMetadata(metaData);

    return overrides
      ? this.contract.createAllowlist(signerAddress, totalUnits, tree.root, cid, transferRestriction, overrides)
      : this.contract.createAllowlist(signerAddress, totalUnits, tree.root, cid, transferRestriction);
  };

  /**
   * Split a Hypercert's unit into multiple claims with the given fractions
   * @dev Submit the ID of the claim to split and new fraction values.
   * @notice The sum of the fractions must be equal to the total units of the claim
   * @param claimId - Hypercert claim id
   * @param fractions - Fractions of the Hypercert claim to split
   * @returns Contract transaction
   */
  splitClaimUnits = async (claimId: BigNumberish, fractions: BigNumberish[], overrides?: ethers.Overrides) => {
    this.checkWritable();

    // check if claim exists and is owned by the signer
    if (!(this._config.operator instanceof ethers.Signer)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();

    const claimOwner = await this._contract.ownerOf(claimId);
    if (claimOwner.toLowerCase() !== signerAddress.toLowerCase())
      throw new ClientError("Claim is not owned by the signer", { signer: signerAddress, claimOwner });

    // check if the sum of the fractions is equal to the total units
    const totalUnits = await this._contract["unitsOf(uint256)"](claimId);
    const sumFractions = fractions.reduce((a, b) => BigNumber.from(a).add(b), BigNumber.from(0));
    if (!BigNumber.from(sumFractions).eq(totalUnits))
      throw new ClientError("Sum of fractions is not equal to the total units", { totalUnits, sumFractions });

    return overrides
      ? this.contract.splitFraction(signerAddress, claimId, fractions, overrides)
      : this.contract.splitFraction(signerAddress, claimId, fractions);
  };

  /**
   * Merge multiple Hypercert claims fractions into one
   * @dev Merges multiple Hypercert claims into one
   * @param claimIds - Hypercert claim ids
   * @returns Contract transaction
   */
  mergeClaimUnits = async (claimIds: BigNumberish[], overrides?: ethers.Overrides) => {
    this.checkWritable();

    // check if all claims exist and are owned by the signer
    if (!(this._config.operator instanceof ethers.Signer)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();

    const claims = await Promise.all(claimIds.map(async (id) => ({ id, owner: await this._contract.ownerOf(id) })));
    if (claims.some((c) => c.owner.toLowerCase() !== signerAddress.toLowerCase())) {
      const invalidClaimIDs = claims.filter((c) => c.owner !== signerAddress).map((c) => c.id);
      throw new ClientError("One or more claims are not owned by the signer", {
        signer: signerAddress,
        claims: invalidClaimIDs,
      });
    }

    return overrides
      ? this.contract.mergeFractions(signerAddress, claimIds, overrides)
      : this.contract.mergeFractions(signerAddress, claimIds);
  };

  /**
   * Burn a Hypercert claim by providing the claim id
   * @dev Burns a Hypercert claim
   * @param claimId - Hypercert claim id
   * @returns Contract transaction
   */
  burnClaimFraction = async (claimId: BigNumberish, overrides?: ethers.Overrides) => {
    this.checkWritable();

    // check if claim exists and is owned by the signer
    if (!(this._config.operator instanceof ethers.Signer)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();
    const claimOwner = await this._contract.ownerOf(claimId);
    if (claimOwner.toLowerCase() !== signerAddress.toLowerCase())
      throw new ClientError("Claim is not owned by the signer", { signer: signerAddress, claimOwner });

    return overrides
      ? this.contract.burnFraction(signerAddress, claimId, overrides)
      : this.contract.burnFraction(signerAddress, claimId);
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
    claimId: BigNumberish,
    units: BigNumberish,
    proof: BytesLike[],
    root?: BytesLike,
    overrides?: ethers.Overrides,
  ): Promise<ContractTransaction> => {
    this.checkWritable();

    if (!(this._config.operator instanceof ethers.Signer)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();
    //verify the proof using the OZ merkle tree library
    if (root && root.length > 0) {
      verifyMerkleProof(
        root.toString(),
        signerAddress,
        units,
        proof.map((p) => p.toString()),
      );
    }

    return overrides
      ? this.contract.mintClaimFromAllowlist(signerAddress, proof, claimId, units, overrides)
      : this.contract.mintClaimFromAllowlist(signerAddress, proof, claimId, units);
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
    claimIds: BigNumberish[],
    units: BigNumberish[],
    proofs: BytesLike[][],
    roots?: BytesLike[],
    overrides?: ethers.Overrides,
  ): Promise<ContractTransaction> => {
    this.checkWritable();

    if (!(this._config.operator instanceof ethers.Signer)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();

    //verify the proof using the OZ merkle tree library
    if (roots && roots.length > 0) {
      verifyMerkleProofs(
        roots.map((r) => r.toString()),
        signerAddress,
        units,
        proofs.map((p) => p.map((p) => p.toString())),
      );
    }

    return overrides
      ? this.contract.batchMintClaimsFromAllowlists(signerAddress, proofs, claimIds, units, overrides)
      : this.contract.batchMintClaimsFromAllowlists(signerAddress, proofs, claimIds, units);
  };

  private checkWritable = () => {
    //TODO add check on ContractRunner when migrating to ethers v6
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });

    return true;
  };
}
