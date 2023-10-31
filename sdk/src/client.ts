import { HypercertMinter, HypercertMinterAbi } from "@hypercerts-org/contracts";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { BigNumber, BigNumberish, BytesLike, ContractTransaction, ethers } from "ethers";

import HypercertEvaluator from "./evaluations";
import HypercertIndexer from "./indexer";
import HypercertsStorage from "./storage";
import {
  AllowlistEntry,
  ClientError,
  HypercertClientConfig,
  HypercertClientInterface,
  HypercertMetadata,
  InvalidOrMissingError,
  MalformedDataError,
  TransferRestrictions,
  Operator,
} from "./types/index";
import { getWritableConfig, getReadOnlyConfig } from "./utils/config";
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
  private _config: HypercertClientConfig;
  private _storage: HypercertsStorage;
  // TODO better handling readonly. For now not needed since we don't use this class;
  private _evaluator: HypercertEvaluator | undefined;
  private _indexer: HypercertIndexer;
  //TODO added the TypedDataSigner since that's needed for EAS signing. Will this work on front-end?
  private _contract: HypercertMinter | undefined;
  readonly: boolean;

  /**
   * Creates a new instance of the `HypercertClient` class.
   * @param config The configuration options for the client.
   */
  constructor(config: Partial<HypercertClientConfig>) {
    this._config = getReadOnlyConfig(config);

    this._storage = new HypercertsStorage(this._config);

    this._indexer = new HypercertIndexer(this._config);

    this.readonly = this._config.readOnly || this._storage.readonly;

    this._contract = this._config.contractAddress
      ? <HypercertMinter>new ethers.Contract(this._config.contractAddress, HypercertMinterAbi)
      : undefined;

    if (this.readonly) {
      logger.warn("HypercertsClient is in readonly mode", "client");
    }
  }

  /**
   * Connect the client to an operator.
   * @param operator The operator to connect to.
   */
  connect = async (operator: Operator) => {
    this._config = await getWritableConfig({ ...this._config, operator });

    this._indexer = new HypercertIndexer(this._config);

    this._evaluator = new HypercertEvaluator(this._config);

    this._contract = <HypercertMinter>new ethers.Contract(this._config.contractAddress, HypercertMinterAbi, operator);

    this.readonly = this._config.readOnly || this._storage.readonly || !this._contract;

    if (this.readonly) {
      logger.warn("HypercertsClient is in readonly mode", "client");
      logger.warn(this._config.readOnlyReason ?? "No reason provided", "client");
    }

    return this;
  };

  /**
   * Gets the config for the client.
   * @returns The client config.
   */
  get config(): HypercertClientConfig {
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
  get contract(): HypercertMinter | undefined {
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

    const contract = this.contract;
    if (!contract) throw new ClientError("Contract is undefined", { client: this });

    if (!ethers.Signer.isSigner(this._config.operator)) {
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
      ? contract.mintClaim(signerAddress, totalUnits, cid, transferRestriction, overrides)
      : contract.mintClaim(signerAddress, totalUnits, cid, transferRestriction);
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

    const contract = this.contract;
    if (!contract) throw new ClientError("Contract is undefined", { client: this });

    if (!ethers.Signer.isSigner(this._config.operator)) {
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
      ? contract.createAllowlist(signerAddress, totalUnits, tree.root, cid, transferRestriction, overrides)
      : contract.createAllowlist(signerAddress, totalUnits, tree.root, cid, transferRestriction);
  };

  /**
   * Split a Hypercert's unit into multiple claims with the given fractions
   * @dev Submit the ID of the claim to split and new fraction values.
   * @notice The sum of the fractions must be equal to the total units of the claim
   * @param fractionId - Hypercert claim id
   * @param newFractions - Fractions of the Hypercert claim to split
   * @returns Contract transaction
   */
  splitFractionUnits = async (fractionId: BigNumberish, newFractions: BigNumberish[], overrides?: ethers.Overrides) => {
    this.checkWritable();

    const contract = this.contract;
    if (!contract) throw new ClientError("Contract is undefined", { client: this });

    // check if claim exists and is owned by the signer
    if (!ethers.Signer.isSigner(this._config.operator)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();
    const claimOwner = await contract.ownerOf(fractionId);

    if (claimOwner.toLowerCase() !== signerAddress.toLowerCase())
      throw new ClientError("Claim is not owned by the signer", { signer: signerAddress, claimOwner });

    // check if the sum of the fractions is equal to the total units
    const totalUnits = await contract["unitsOf(uint256)"](fractionId);
    const sumFractions = newFractions.reduce((a, b) => BigNumber.from(a).add(b), BigNumber.from(0));
    if (!BigNumber.from(sumFractions).eq(totalUnits))
      throw new ClientError("Sum of fractions is not equal to the total units", { totalUnits, sumFractions });

    return overrides
      ? contract.splitFraction(signerAddress, fractionId, newFractions, overrides)
      : contract.splitFraction(signerAddress, fractionId, newFractions);
  };

  /**
   * Merge multiple Hypercert claims fractions into one
   * @dev Merges multiple Hypercert claims into one
   * @param fractionIds - Hypercert claim ids
   * @returns Contract transaction
   */
  mergeClaimFractions = async (fractionIds: BigNumberish[], overrides?: ethers.Overrides) => {
    this.checkWritable();

    const contract = this.contract;
    if (!contract) throw new ClientError("Contract is undefined", { client: this });

    // check if all claims exist and are owned by the signer
    if (!ethers.Signer.isSigner(this._config.operator)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();

    const claims = await Promise.all(fractionIds.map(async (id) => ({ id, owner: await contract.ownerOf(id) })));
    if (claims.some((c) => c.owner.toLowerCase() !== signerAddress.toLowerCase())) {
      const invalidClaimIDs = claims.filter((c) => c.owner !== signerAddress).map((c) => c.id);
      throw new ClientError("One or more claims are not owned by the signer", {
        signer: signerAddress,
        claims: invalidClaimIDs,
      });
    }

    return overrides
      ? contract.mergeFractions(signerAddress, fractionIds, overrides)
      : contract.mergeFractions(signerAddress, fractionIds);
  };

  /**
   * Burn a Hypercert claim by providing the claim id
   * @dev Burns a Hypercert claim
   * @param fractionId - Hypercert claim id
   * @returns Contract transaction
   */
  burnClaimFraction = async (fractionId: BigNumberish, overrides?: ethers.Overrides) => {
    this.checkWritable();

    const contract = this.contract;
    if (!contract) throw new ClientError("Contract is undefined", { client: this });

    // check if claim exists and is owned by the signer
    if (!ethers.Signer.isSigner(this._config.operator)) {
      throw new InvalidOrMissingError("Invalid operator: not a signer", { operator: this._config.operator });
    }

    const signerAddress = await this._config.operator.getAddress();
    const claimOwner = await contract.ownerOf(fractionId);
    if (claimOwner.toLowerCase() !== signerAddress.toLowerCase())
      throw new ClientError("Claim is not owned by the signer", { signer: signerAddress, claimOwner });

    return overrides
      ? contract.burnFraction(signerAddress, fractionId, overrides)
      : contract.burnFraction(signerAddress, fractionId);
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

    const contract = this.contract;
    if (!contract) throw new ClientError("Contract is undefined", { client: this });

    if (!ethers.Signer.isSigner(this._config.operator)) {
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
      ? contract.mintClaimFromAllowlist(signerAddress, proof, claimId, units, overrides)
      : contract.mintClaimFromAllowlist(signerAddress, proof, claimId, units);
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

    const contract = this.contract;
    if (!contract) throw new ClientError("Contract is undefined", { client: this });

    if (!ethers.Signer.isSigner(this._config.operator)) {
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
      ? contract.batchMintClaimsFromAllowlists(signerAddress, proofs, claimIds, units, overrides)
      : contract.batchMintClaimsFromAllowlists(signerAddress, proofs, claimIds, units);
  };

  private checkWritable = () => {
    //TODO add check on ContractRunner when migrating to ethers v6
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });

    return true;
  };
}
