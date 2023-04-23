import { HypercertMinter, HypercertMinterABI } from "@hypercerts-org/hypercerts-protocol";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { BigNumber, BigNumberish, ContractTransaction, ethers } from "ethers";

import { Config, getConfig } from "./config.js";
import { ClientError, MalformedDataError, StorageError } from "./errors.js";
import { HypercertMetadata, HypercertsStorage, validateMetaData } from "./index.js";
import { validateAllowlist } from "./validator/index.js";

/**
 * Transfer restrictions for Hypercerts matching the definitions in the Hypercerts protocol
 * @dev AllowAll: All transfers are allowed
 * @dev DisallowAll: All transfers are disallowed
 * @dev FromCreatorOnly: Only the creator can transfer the Hypercert
 *
 */
export enum TransferRestrictions {
  AllowAll = 0,
  DisallowAll = 1,
  FromCreatorOnly = 2,
}

/**
 * Allowlist entry for Hypercerts matching the definitions in the Hypercerts protocol
 * @param address - Address of the recipient
 * @param units - Number of units allocated to the recipient
 */
export type AllowlistEntry = {
  address: string;
  units: BigNumberish;
};

/**
 * Helper type to allow for a more readable Allowlist type
 */
export type Allowlist = AllowlistEntry[];

/**
 * Hypercerts client configuration
 * @param config - Hypercerts client configuration
 * @param storage - Hypercerts storage configuration
 */
type HypercertClientConfig = {
  config: Partial<Config>;
  storage: HypercertsStorage;
};

/**
 * Hypercerts client interface
 * @param readonly - Indicates if the client is readonly
 * @param config - Hypercerts client configuration
 * @param provider - Ethers provider
 * @param contract - Hypercerts contract
 * @param storage - Hypercerts storage
 * @param mintClaim - Wrapper function to mint a Hypercert claim
 * @param createAllowlist - Wrapper function to mint a Hypercert claim with an allowlist
 */
type HypercertClientInterface = {
  readonly: boolean;
  config: Config;
  provider: ethers.providers.JsonRpcProvider;
  contract: HypercertMinter;
  storage: HypercertsStorage;
  mintClaim: (
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => Promise<ContractTransaction>;
  createAllowlist: (
    allowList: Allowlist,
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => Promise<ContractTransaction>;
  splitClaimUnits: (claimId: BigNumberish, fractions: BigNumberish[]) => Promise<ContractTransaction>;
  mergeClaimUnits: (claimIds: BigNumberish[]) => Promise<ContractTransaction>;
  burnClaimFraction: (claimId: BigNumberish) => Promise<ContractTransaction>;
};

/**
 * Hypercerts client factory
 * @dev Creates a Hypercerts client instance
 * @notice The client is readonly if no signer is set or if the contract address is not set
 * @param config - Hypercerts client configuration
 * @param storage - Hypercerts storage object
 */
export class HypercertClient implements HypercertClientInterface {
  config: Config;
  storage: HypercertsStorage;
  provider: ethers.providers.JsonRpcProvider;
  contract: HypercertMinter;
  readonly: boolean;

  constructor({ config, storage }: HypercertClientConfig) {
    this.config = getConfig(config);
    this.storage = storage ?? new HypercertsStorage({});
    this.provider = new ethers.providers.JsonRpcProvider(this.config.rpcUrl);
    this.contract = <HypercertMinter>(
      new ethers.Contract(this.config.contractAddress, HypercertMinterABI, this.provider)
    );

    this.readonly = !this.provider._isProvider || this.contract.address === undefined;
    if (this.readonly) console.warn("Client is readonly. No signer is set.");
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
  ): Promise<ContractTransaction> => {
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this.config.signer) throw new ClientError("Client signer is not set", { client: this });

    // validate metadata
    const { valid, errors } = validateMetaData(metaData);
    if (!valid && Object.keys(errors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", errors);
    }

    // store metadata on IPFS
    const cid = await this.storage.storeMetadata(metaData);

    return this.contract.mintClaim(this.config.signer.getAddress(), totalUnits, cid, transferRestriction);
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
    allowList: Allowlist,
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => {
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this.config.signer) throw new ClientError("Client signer is not set", { client: this });

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

    if (!cidMerkle) throw new StorageError("Unable to store allowlist on IPFS");

    metaData.allowList = cidMerkle;
    // store metadata on IPFS
    const cid = await this.storage.storeMetadata(metaData);

    return this.contract.createAllowlist(
      this.config.signer.getAddress(),
      totalUnits,
      tree.root,
      cid,
      transferRestriction,
    );
  };

  /**
   * Split a Hypercert claim into multiple claims
   * @dev Splits a Hypercert claim into multiple claims with the given fractions
   * @param claimId - Hypercert claim id
   * @param fractions - Fractions of the Hypercert claim to split
   * @returns Contract transaction
   */
  splitClaimUnits = async (claimId: BigNumberish, fractions: BigNumberish[]) => {
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this.config.signer) throw new ClientError("Client signer is not set", { client: this });

    // check if claim exists and is owned by the signer
    const signerAddress = await this.config.signer.getAddress();
    const claim = await this.contract.ownerOf(claimId);
    if (claim !== signerAddress)
      throw new ClientError("Claim is not owned by the signer", { signer: signerAddress, claimId });

    // check if the sum of the fractions is equal to the total units
    const totalUnits = await this.contract["unitsOf(uint256)"](claimId);
    const sumFractions = fractions.reduce((a, b) => BigNumber.from(a).add(b), BigNumber.from(0));
    if (sumFractions !== totalUnits)
      throw new ClientError("Sum of fractions is not equal to the total units", { totalUnits, sumFractions });

    return this.contract.splitFraction(signerAddress, claimId, fractions);
  };

  /**
   * Merge multiple Hypercert claims into one
   * @dev Merges multiple Hypercert claims into one
   * @param claimIds - Hypercert claim ids
   * @returns Contract transaction
   */
  mergeClaimUnits = async (claimIds: BigNumberish[]) => {
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this.config.signer) throw new ClientError("Client signer is not set", { client: this });

    // check if all claims exist and are owned by the signer
    const signerAddress = await this.config.signer.getAddress();
    const claims = await Promise.all(claimIds.map(async (id) => ({ id, owner: await this.contract.ownerOf(id) })));
    if (claims.some((c) => c.owner !== signerAddress)) {
      const invalidClaimIDs = claims.filter((c) => c.owner !== signerAddress).map((c) => c.id);
      throw new ClientError("One or more claims are not owned by the signer", {
        signer: signerAddress,
        claims: invalidClaimIDs,
      });
    }

    return this.contract.mergeFractions(signerAddress, claimIds);
  };

  /**
   * Burn a Hypercert claim
   * @dev Burns a Hypercert claim
   * @param claimId - Hypercert claim id
   * @returns Contract transaction
   */
  burnClaimFraction = async (claimId: BigNumberish) => {
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this.config.signer) throw new ClientError("Client signer is not set", { client: this });

    // check if claim exists and is owned by the signer
    const signerAddress = await this.config.signer.getAddress();
    const claim = await this.contract.ownerOf(claimId);
    if (claim !== signerAddress)
      throw new ClientError("Claim is not owned by the signer", { signer: signerAddress, claimId });

    return this.contract.burnFraction(signerAddress, claimId);
  };
}
