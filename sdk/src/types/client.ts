import { AllowlistEntry, TransferRestrictions } from "./hypercerts";
import { HypercertMetadata } from "./metadata";

import { ByteArray, Hex, PublicClient, WalletClient } from "viem";
import { AxiosRequestConfig } from "axios";

export type TestChainIds = 11155111 | 84532 | 421614;
export type ProductionChainIds = 10 | 42220 | 8453;

/**
 * Enum to verify the supported chainIds
 *
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
  /**
   * The environment to run the indexer in. This can be either production, test or all. Defaults to test.
   */
  environment: Environment;
  /**
   * The deployments of the contracts on various networks.
   */
  deployments: { [k: string]: Deployment };
  /**
   * Boolean to assert if the client is in read-only mode.
   */
  readOnly: boolean;
  /**
   * The URL of the graph endpoint.
   */
  graphUrl: string;
  /**
   * The PublicClient is inherently read-only.
   */
  publicClient?: PublicClient;
  /**
   * The WalletClient is used for signing and sending transactions.
   */
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
}

export interface TransactionParams {
  overrides?: SupportedOverrides;
}

export interface MintParams extends TransactionParams {
  metaData: HypercertMetadata;
  totalUnits: bigint;
  transferRestriction: TransferRestrictions;
  allowList?: AllowlistEntry[] | string;
}

export interface TransferParams extends TransactionParams {
  fractionId: bigint;
  to: `0x${string}`;
}

export interface BatchTransferParams extends TransactionParams {
  fractionIds: bigint[];
  to: `0x${string}`;
}

export interface SplitFractionParams extends TransactionParams {
  fractionId: bigint;
  fractions: bigint[];
}

export interface MergeFractionsParams extends TransactionParams {
  fractionIds: bigint[];
}

export interface BurnFractionParams extends TransactionParams {
  fractionId: bigint;
}

export interface ClaimFractionFromAllowlistParams extends TransactionParams {
  hypercertTokenId: bigint;
  units: bigint;
  proof: (Hex | ByteArray)[];
  root?: Hex | ByteArray;
}

export interface BatchClaimFractionsFromAllowlistsParams extends TransactionParams {
  hypercertTokenIds: bigint[];
  units: bigint[];
  proofs: (Hex | ByteArray)[][];
  roots?: (Hex | ByteArray)[];
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
   * @deprecated use `mintClaim` with optional `allowList` parameter instead
   */
  mintClaim: (
    metaData: HypercertMetadata,
    totalUnits: bigint,
    transferRestriction: TransferRestrictions,
    allowList?: AllowlistEntry[],
  ) => Promise<`0x${string}` | undefined>;

  /**
   * Mints a new hypercert.
   * @param metaData The metadata for the hypercert.
   * @param totalUnits The total number of units for the hypercert.
   * @param transferRestriction The transfer restriction for the hypercert.
   * @returns A Promise that resolves to the transaction hash
   */
  mintHypercert: (params: MintParams) => Promise<`0x${string}` | undefined>;

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
  transferFraction: (params: TransferParams) => Promise<`0x${string}` | undefined>;

  /**
   * Transfers multiple claim fractions to a new owner.
   * @param fractionIds
   * @param to
   * @param overrides
   * @returns A Promise that resolves to the transaction hash
   */
  batchTransferFractions: (params: BatchTransferParams) => Promise<`0x${string}` | undefined>;

  /**
   * Creates a new allowlist and mints a new claim with the allowlist.
   * @param allowList The allowlist for the claim.
   * @param metaData The metadata for the claim.
   * @param totalUnits The total number of units for the claim.
   * @param transferRestriction The transfer restriction for the claim.
   * @returns A Promise that resolves to the transaction hash
   * @deprecated use `mintHypercert` with optional `allowList` parameter instead
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
   * @deprecated use `splitFraction` instead
   */
  splitFractionUnits: (fractionId: bigint, fractions: bigint[]) => Promise<`0x${string}` | undefined>;

  /**
   * Splits a claim into multiple fractions.
   * @param fractionId The ID of the claim to split.
   * @param newFractions The number of units for each fraction.
   * @returns A Promise that resolves to the transaction hash
   */
  splitFraction: (params: SplitFractionParams) => Promise<`0x${string}` | undefined>;

  /**
   * Merges multiple claim fractions into a single claim.
   * @param fractionIds The IDs of the claim fractions to merge.
   * @returns A Promise that resolves to the transaction hash
   * @deprecated use `mergeFractions` instead
   */
  mergeFractionUnits: (fractionIds: bigint[]) => Promise<`0x${string}` | undefined>;

  /**
   * Merges multiple claim fractions into a single claim.
   * @param fractionIds The IDs of the claim fractions to merge.
   * @returns A Promise that resolves to the transaction hash
   */
  mergeFractions: (params: MergeFractionsParams) => Promise<`0x${string}` | undefined>;

  /**
   * Burns a claim fraction.
   * @param fractionId The ID of the claim fraction to burn.
   * @returns A Promise that resolves to the transaction hash
   * @deprecated use `burnFraction` instead
   */
  burnClaimFraction: (fractionId: bigint) => Promise<`0x${string}` | undefined>;

  /**
   * Burns a claim fraction.
   * @param fractionId The ID of the claim fraction to burn.
   * @returns A Promise that resolves to the transaction hash
   */
  burnFraction: (params: BurnFractionParams) => Promise<`0x${string}` | undefined>;

  /**
   * Mints a claim fraction from an allowlist.
   * @param claimId The ID of the claim to mint a fraction for.
   * @param units The number of units for the fraction.
   * @param proof The Merkle proof for the allowlist.
   * @returns A Promise that resolves to the transaction hash
   * @deprecated use `claimFractionFromAllowlist` instead
   */
  mintClaimFractionFromAllowlist: (
    claimId: bigint,
    units: bigint,
    proof: (Hex | ByteArray)[],
  ) => Promise<`0x${string}` | undefined>;

  /**
   * Mints a claim fraction from an allowlist.
   * @param claimId The ID of the claim to mint a fraction for.
   * @param units The number of units for the fraction.
   * @param proof The Merkle proof for the allowlist.
   * @returns A Promise that resolves to the transaction hash
   */
  claimFractionFromAllowlist: (params: ClaimFractionFromAllowlistParams) => Promise<`0x${string}` | undefined>;

  /**
   * Batch mints a claim fraction from an allowlist
   * @param claimIds Array of the IDs of the claims to mint fractions for.
   * @param units Array of the number of units for each fraction.
   * @param proofs Array of Merkle proofs for the allowlists.
   * @returns A Promise that resolves to the transaction receipt
   * @note The length of the arrays must be equal.
   * @note The order of the arrays must be equal.
   * @returns A Promise that resolves to the transaction hash
   * @deprecated use `batchClaimFractionsFromAllowlists` instead
   */
  batchMintClaimFractionsFromAllowlists: (
    claimIds: bigint[],
    units: bigint[],
    proofs: (Hex | ByteArray)[][],
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
  batchClaimFractionsFromAllowlists: (
    params: BatchClaimFractionsFromAllowlistsParams,
  ) => Promise<`0x${string}` | undefined>;

  /**
   * Check if a claim or fraction is on the chain that the Hypercertclient
   * is currently connected to
   * @param claimOrFractionId The ID of the claim or fraction to check.
   * @deprecated use `isHypercertsOrFractionOnConnectedChain` instead
   */
  isClaimOrFractionOnConnectedChain: (claimOrFractionId: string) => boolean;

  /**
   * Check if a claim or fraction is on the chain that the Hypercertclient
   * is currently connected to
   * @param claimOrFractionId The ID of the claim or fraction to check.
   */
  isHypercertsOrFractionOnConnectedChain: (claimOrFractionId: string) => boolean;
}
