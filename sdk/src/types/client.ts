import { PartialTypedDataConfig } from "@ethereum-attestation-service/eas-sdk";

import { HypercertIndexer } from "../indexer";
import { AllowlistEntry, TransferRestrictions } from "./hypercerts";
import { HypercertMetadata } from "./metadata";

import { ByteArray, Chain, Hex, PublicClient, WalletClient, GetContractReturnType } from "viem";
import { HypercertMinterAbi } from "@hypercerts-org/contracts";

/**
 * Enum to verify the supported chainIds
 *
 * @note 10 = Optimism, 42220 = Celo, 11155111 = Sepolia
 */
export type SupportedChainIds = 10 | 42220 | 11155111;

export type SupportedOverrides = ContractOverrides & StorageConfigOverrides;

/**
 * Configuration options for the contract interactions.
 *
 * @param value The value to send with the transaction (in wei).
 * @param gasPrice The gas price to use for the transaction (in wei).
 * @param gasLimit The gas limit to use for the transaction (in wei).
 */
export type ContractOverrides = {
  value?: bigint;
  gasPrice?: bigint;
  gasLimit?: bigint;
};

/**
 * Configuration options for the Hypercert storage layer.
 * @param timeout The timeout (im ms) for the HTTP request; for example for uploading metadata or fetching allowlists.
 */
export type StorageConfigOverrides = {
  // Axios timout in ms
  timeout?: number;
};

export type Contracts =
  | "HypercertMinterUUPS"
  | "TransferManager"
  | "ProtocolFeeRecipient"
  | "HypercertExchange"
  | "RoyaltyFeeRegistry"
  | "OrderValidator"
  | "CreatorFeeManager"
  | "StrategyCollectionOffer"
  | "StrategyDutchAuction"
  | "StrategyItemIdsRange"
  | "StrategyHypercertCollectionOffer"
  | "StrategyHypercertDutchAuction"
  | "StrategyHypercertFractionOffer";

/**
 * Represents a deployment of a contract on a specific network.
 */
export type Deployment = {
  chain: Partial<Chain>;
  /** The address of the deployed contract. */
  addresses: Partial<Record<Contracts, `0x${string}`>>;
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
 *
 * @deprecated nft.storage and web3.storage are no longer used
 */
export type HypercertStorageConfig = {
  /** The API token for NFT.storage. */
  nftStorageToken?: string;
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
   * Stores the allowlost for a hypercert.
   * @param allowList The metadata to store.
   * @param {StorageConfigOverrides} [config] - An optional configuration object.
   * @returns A Promise that resolves to the CID of the stored metadata.
   */
  storeAllowList: (allowList: AllowlistEntry[], totalUnits: bigint, config?: StorageConfigOverrides) => Promise<string>;

  /**
   * Stores the metadata for a hypercert.
   * @param metadata The metadata to store.
   * @param {StorageConfigOverrides} [config] - An optional configuration object.
   * @returns A Promise that resolves to the CID of the stored metadata.
   */
  storeMetadata: (metadata: HypercertMetadata, config?: StorageConfigOverrides) => Promise<string>;

  /**
   * Retrieves the metadata for a hypercerts.
   * @param cidOrIpfsUri The CID or IPFS URI of the metadata to retrieve.
   * @param {StorageConfigOverrides} [config] - An optional configuration object.
   * @returns A Promise that resolves to the retrieved metadata.
   */
  getMetadata: (cidOrIpfsUri: string, config?: StorageConfigOverrides) => Promise<HypercertMetadata>;

  /**
   * Retrieves arbitrary data from IPFS.
   * @param cidOrIpfsUri The CID or IPFS URI of the data to retrieve.
   * @param {StorageConfigOverrides} [config] - An optional configuration object.
   * @returns A Promise that resolves to the retrieved data.
   */
  getData: (cidOrIpfsUri: string, config?: StorageConfigOverrides) => Promise<unknown>;
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
   * Gets the contract addresses and graph urls for the provided `chainId`
   * @returns The addresses, graph name and graph url.
   */
  getDeployment: (chainId: SupportedChainIds) => Partial<Deployment>;

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
