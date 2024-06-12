import { HypercertIndexer } from "../indexer";
import { AllowlistEntry, TransferRestrictions } from "./hypercerts";
import { HypercertMetadata } from "./metadata";

import { ByteArray, Hex, PublicClient, WalletClient } from "viem";
import { AxiosRequestConfig } from "axios";

export type TestChainIds = 11155111 | 84532;
export type ProductionChainIds = 10 | 42220 | 8453;

/**
 * Enum to verify the supported chainIds
 *
 * @note 10 = Optimism, 42220 = Celo, 11155111 = Sepolia, 84532 = Base Sepolia, 8453 = Base Mainnet
 */
export type SupportedChainIds = TestChainIds | ProductionChainIds;

export type SupportedOverrides = ContractOverrides & AxiosRequestConfig;

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

export type Contracts =
  | "HypercertMinterUUPS"
  | "TransferManager"
  | "ProtocolFeeRecipient"
  | "HypercertExchange"
  | "RoyaltyFeeRegistry"
  | "OrderValidator"
  | "CreatorFeeManager"
  | "StrategyHypercertFractionOffer";

/**
 * Represents a deployment of a contract on a specific network.
 */
export type Deployment = {
  chainId: SupportedChainIds;
  /** The address of the deployed contract. */
  addresses: Partial<Record<Contracts, `0x${string}`>>;
  isTestnet: boolean;
};

/**
 * Configuration options for the Hypercert client.
 */
export type HypercertClientConfig = {
  /** The environment to run the indexer in. This can be either production, test or all. Defaults to test */
  environment: Environment;
  deployments: { [k: string]: Deployment };
  /** Boolean to assert if the client is in readOnly mode */
  readOnly: boolean;
  graphUrl: string;
  /** The PublicClient is inherently read-only */
  publicClient?: PublicClient;
  walletClient?: WalletClient;
};

/**
 * The environment to run the indexer in.
 * Production will run against all mainnet chains, while test will run against testnet chains.
 * All will run against both
 */
export type Environment = "production" | "test";

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
  readOnly: boolean;
  /** The indexer used by the client. */
  indexer: HypercertIndexer;
}

/**
 * The methods for the Hypercert client.
 */
export interface HypercertClientMethods {
  /**
   * Gets the contract addresses and graph urls for the provided `chainId`
   * @returns The addresses, graph name and graph url.
   */
  getDeployments: ({ chainId, environment }: { chainId?: SupportedChainIds; environment?: Environment }) => {
    [k: string]: Deployment;
  };

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

  /**
   * Check if a claim or fraction is on the chain that the Hypercertclient
   * is currently connected to
   * @param claimOrFractionId The ID of the claim or fraction to check.
   */
  isClaimOrFractionOnConnectedChain: (claimOrFractionId: string) => boolean;
}
