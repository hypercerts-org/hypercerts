import { HypercertMinter, HypercertMinterABI } from "@hypercerts-org/hypercerts-protocol";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { BigNumber, BigNumberish, BytesLike, ContractTransaction, ethers } from "ethers";

import { DEFAULT_CHAIN_ID } from "./constants.js";
import { HypercertMetadata, validateMetaData } from "./index.js";
import HypercertsStorage from "./storage.js";
import { HypercertClientConfig, HypercertClientInterface, HypercertClientProps } from "./types/client.js";
import { ClientError, MalformedDataError, MintingError, StorageError } from "./types/errors.js";
import { Allowlist, TransferRestrictions } from "./types/hypercerts.js";
import { getConfig } from "./utils/config.js";
import { validateAllowlist } from "./validator/index.js";

/**
 * Hypercerts client factory
 * @dev Creates a Hypercerts client instance
 * @notice The client is readonly if no signer is set or if the contract address is not set
 * @param config - Hypercerts client configuration
 * @param storage - Hypercerts storage object
 */
export default class HypercertClient implements HypercertClientInterface {
  config: HypercertClientConfig;
  storage: HypercertsStorage;
  provider: ethers.providers.Provider;
  signer?: ethers.Signer;
  contract: HypercertMinter;
  readonly: boolean;

  constructor({ config = { chainId: DEFAULT_CHAIN_ID }, storage }: HypercertClientProps) {
    this.config = getConfig(config);
    this.storage = storage ?? new HypercertsStorage({});
    this.provider =
      config.provider ??
      new ethers.providers.JsonRpcProvider(this.config.rpcUrl) ??
      ethers.getDefaultProvider("goerli");
    this.signer = this.config.signer ?? undefined;

    this.contract = <HypercertMinter>(
      new ethers.Contract(this.config.contractAddress, HypercertMinterABI, this.signer || this.provider)
    );

    this.readonly = !this.signer || !this.provider || this.contract.address === undefined || this.storage.readonly;
    if (this.readonly) {
      console.log("HypercertsClient is in readonly mode");
      console.log("HypercertsClient signer: ", this.signer);
      console.log("HypercertsClient provider: ", this.provider);
      console.log("HypercertsClient contract address: ", this.contract.address);
      console.log("HypercertsClient storage: ", this.storage);
    }
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
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this.config.signer) throw new ClientError("Client signer is not set", { client: this });

    // validate metadata
    const { valid, errors } = validateMetaData(metaData);
    if (!valid && Object.keys(errors).length > 0) {
      throw new MalformedDataError("Metadata validation failed", errors);
    }

    // store metadata on IPFS
    const cid = await this.storage.storeMetadata(metaData);

    return overrides
      ? this.contract.mintClaim(this.config.signer.getAddress(), totalUnits, cid, transferRestriction, overrides)
      : this.contract.mintClaim(this.config.signer.getAddress(), totalUnits, cid, transferRestriction);
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
    overrides?: ethers.Overrides,
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

    return overrides
      ? this.contract.createAllowlist(
          this.config.signer.getAddress(),
          totalUnits,
          tree.root,
          cid,
          transferRestriction,
          overrides,
        )
      : this.contract.createAllowlist(this.config.signer.getAddress(), totalUnits, tree.root, cid, transferRestriction);
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
    if (!BigNumber.from(sumFractions).eq(totalUnits))
      throw new ClientError("Sum of fractions is not equal to the total units", { totalUnits, sumFractions });

    console.log("CALLING SPLIT FREACTION");
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
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this.config.signer) throw new ClientError("Client signer is not set", { client: this });

    // check if claim exists and is owned by the signer
    const signerAddress = await this.config.signer.getAddress();
    const claim = await this.contract.ownerOf(claimId);
    if (claim !== signerAddress)
      throw new ClientError("Claim is not owned by the signer", { signer: signerAddress, claimId });

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
    if (this.readonly) throw new ClientError("Client is readonly", { client: this });
    if (!this.config.signer) throw new ClientError("Client signer is not set", { client: this });

    const signerAddress = await this.config.signer.getAddress();

    //verify the proof using the OZ merkle tree library
    if (root && root.length > 0) {
      const verified = StandardMerkleTree.verify(
        root.toString(),
        ["address", "uint"],
        [signerAddress, units],
        proof.map((value) => value.toString()),
      );
      if (!verified) throw new MintingError("Merkle proof verification failed", { root, proof });
    }

    return overrides
      ? this.contract.mintClaimFromAllowlist(signerAddress, proof, claimId, units, overrides)
      : this.contract.mintClaimFromAllowlist(signerAddress, proof, claimId, units);
  };
}
