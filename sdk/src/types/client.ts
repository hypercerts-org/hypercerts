import { PartialTypedDataConfig } from "@ethereum-attestation-service/eas-sdk";
//eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CIDString } from "nft.storage";

import { HypercertIndexer } from "../indexer";
import { AllowlistEntry, TransferRestrictions } from "./hypercerts";
import { HypercertMetadata } from "./metadata";

import { ByteArray, Chain, Hex, PublicClient, WalletClient, GetContractReturnType } from "viem";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

export type SupportedChainIds = 5 | 10 | 42220 | 11155111;
export type SupportedOverrides = {
  value?: bigint;
  gasPrice?: bigint;
  gasLimit?: bigint;
};

/**
 * Represents a deployment of a contract on a specific network.
 */
export type Deployment = {
  chain: Partial<Chain>;
  /** The address of the deployed contract. */
  contractAddress: string;
  /** The url to the subgraph that indexes the contract events. Override for localized testing */
  graphUrl: string;
  graphName: string;
};

/**
 * Configuration options for the Hypercert client.
 */
export type HypercertClientConfig = Deployment &
  HypercertStorageConfig &
  HypercertEvaluatorConfig & {
    /** The PublicClient is inherently read-only */
    publicClient: PublicClient;
    walletClient: WalletClient;
    /** Force the use of overridden values */
    unsafeForceOverrideConfig?: boolean;
    /** Boolean to assert if the client is in readOnly mode */
    readOnly: boolean;
    /** Reason for readOnly mode */
    readOnlyReason?: string;
  };

/**
 * Configuration options for the Hypercert storage layer.
 * @note The API tokens are optional, but required for storing data on NFT.storage and Web3.storage.
 */
export type HypercertStorageConfig = {
  /** The API token for NFT.storage. */
  nftStorageToken?: string;
  /** The API token for Web3.storage. */
  web3StorageToken?: string;
};

/**
 * Configuration options for the Hypercert evaluator.
 * @note The signer is required for submitting evaluations.
 */
export type HypercertEvaluatorConfig = Omit<PartialTypedDataConfig, "address"> & {
  easContractAddress: string;
};

/**
 * The interface for the Hypercert storage layer.
 */
export interface HypercertStorageInterface {
  /**
   * Stores the metadata for a Hypercert evaluation.
   * @param metadata The metadata to store.
   * @returns A Promise that resolves to the CID of the stored metadata.
   */
  storeMetadata: (metadata: HypercertMetadata) => Promise<CIDString>;

  /**
   * Retrieves the metadata for a Hypercert evaluation.
   * @param cidOrIpfsUri The CID or IPFS URI of the metadata to retrieve.
   * @returns A Promise that resolves to the retrieved metadata.
   */
  getMetadata: (cidOrIpfsUri: string) => Promise<HypercertMetadata>;

  /**
   * Stores arbitrary data on IPFS.
   * @param data The data to store.
   * @returns A Promise that resolves to the CID of the stored data.
   */
  storeData: (data: unknown) => Promise<CIDString>;

  /**
   * Retrieves arbitrary data from IPFS.
   * @param cidOrIpfsUri The CID or IPFS URI of the data to retrieve.
   * @returns A Promise that resolves to the retrieved data.
   */
  getData: (cidOrIpfsUri: string) => Promise<unknown>;
}

/**
 * The props for the Hypercert client.
 */
export type HypercertClientProps = {
  /** The configuration options for the Hypercert client. */
  config?: Partial<HypercertClientConfig>;
};

/**
 * The interface for the Hypercert client.
 */
export interface HypercertClientInterface extends HypercertClientMethods, HypercertClientState {}

/**
 * The state of the Hypercert client.
 */
export interface HypercertClientState {
  /** Whether the client is in read-only mode. */
  readonly: boolean;
  /** The storage layer used by the client. */
  storage: HypercertStorageInterface;
  /** The indexer used by the client. */
  indexer: HypercertIndexer;
  contract: GetContractReturnType<typeof HypercertMinterAbi>;
}

/**
 * The methods for the Hypercert client.
 */
export interface HypercertClientMethods {
  /**
   * Mints a new claim.
   * @param metaData The metadata for the claim.
   * @param totalUnits The total number of units for the claim.
   * @param transferRestriction The transfer restriction for the claim.
   * @returns A Promise that resolves to the transaction hash
   */
  mintClaim: (
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
  ) => Promise<`0x${string}` | undefined>;

  /**
   * Retrieves the TransferRestrictions for a claim.
   * @param fractionId The ID of the claim to retrieve.
   * @returns A Promise that resolves to the applicable transfer restrictions.
   */
  getTransferRestrictions: (fractionId: bigint) => Promise<TransferRestrictions>;

  /**
   * Transfers a claim fraction to a new owner.
   * @param fractionId
   * @param to
   * @param overrides
   * @returns A Promise that resolves to the transaction hash
   */
  transferFraction: (
    fractionId: bigint,
    to: `0x${string}`,
    overrides?: SupportedOverrides,
  ) => Promise<`0x${string}` | undefined>;

  /**
   * Transfers multiple claim fractions to a new owner.
   * @param fractionIds
   * @param to
   * @param overrides
   * @returns A Promise that resolves to the transaction hash
   */
  batchTransferFractions: (
    fractionIds: bigint[],
    to: `0x${string}`,
    overrides?: SupportedOverrides,
  ) => Promise<`0x${string}` | undefined>;

  /**
   * Creates a new allowlist and mints a new claim with the allowlist.
   * @param allowList The allowlist for the claim.
   * @param metaData The metadata for the claim.
   * @param totalUnits The total number of units for the claim.
   * @param transferRestriction The transfer restriction for the claim.
   * @returns A Promise that resolves to the transaction hash
   */
  createAllowlist: (
    allowList: AllowlistEntry[],
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
  ) => Promise<`0x${string}` | undefined>;

  /**
   * Splits a claim into multiple fractions.
   * @param fractionId The ID of the claim to split.
   * @param newFractions The number of units for each fraction.
   * @returns A Promise that resolves to the transaction hash
   */
  splitFractionUnits: (fractionId: bigint, fractions: bigint[]) => Promise<`0x${string}` | undefined>;

  /**
   * Merges multiple claim fractions into a single claim.
   * @param fractionIds The IDs of the claim fractions to merge.
   * @returns A Promise that resolves to the transaction hash
   */
  mergeFractionUnits: (fractionIds: bigint[]) => Promise<`0x${string}` | undefined>;

  /**
   * Burns a claim fraction.
   * @param fractionId The ID of the claim fraction to burn.
   * @returns A Promise that resolves to the transaction hash
   */
  burnClaimFraction: (fractionId: bigint) => Promise<`0x${string}` | undefined>;

  /**
   * Mints a claim fraction from an allowlist.
   * @param claimId The ID of the claim to mint a fraction for.
   * @param units The number of units for the fraction.
   * @param proof The Merkle proof for the allowlist.
   * @returns A Promise that resolves to the transaction hash
   */
  mintClaimFractionFromAllowlist: (
    claimId: bigint,
    units: bigint,
    proof: (Hex | ByteArray)[],
  ) => Promise<`0x${string}` | undefined>;

  /**
   * Batch mints a claim fraction from an allowlist
   * @param claimIds Array of the IDs of the claims to mint fractions for.
   * @param units Array of the number of units for each fraction.
   * @param proofs Array of Merkle proofs for the allowlists.
   * @returns A Promise that resolves to the transaction receipt
   * @note The length of the arrays must be equal.
   * @note The order of the arrays must be equal.
   * @returns A Promise that resolves to the transaction hash
   */
  batchMintClaimFractionsFromAllowlists: (
    claimIds: bigint[],
    units: bigint[],
    proofs: (Hex | ByteArray)[][],
  ) => Promise<`0x${string}` | undefined>;
}
