import { PartialTypedDataConfig } from "@ethereum-attestation-service/eas-sdk";
import { HypercertMinter as ContractInterface } from "@hypercerts-org/contracts";
import { BigNumberish, BytesLike, ContractTransaction, ethers } from "ethers";
import { CIDString } from "nft.storage";

import HypercertIndexer from "../indexer.js";
import { Allowlist, TransferRestrictions } from "./hypercerts.js";
import { HypercertMetadata } from "./metadata.js";

export type SupportedChainIds = 5 | 10;

/**
 * Hypercert contract interface.
 * @notice hacky loop to get typedoc to generate all the docs
 */
export interface HypercertMinter extends ContractInterface {}

/**
 * Represents a deployment of a contract on a specific network.
 */
export type Deployment = {
  /** The ID of the network on which the contract is deployed. */
  chainId: number;
  /** The name of the network on which the contract is deployed. */
  chainName: string;
  /** The address of the deployed contract. */
  contractAddress: string;
  /** The name of the subgraph that indexes the contract events. */
  graphName: string;
};

/**
 * Configuration options for the Hypercert client.
 */
export type HypercertClientConfig = Deployment &
  HypercertStorageConfig &
  HypercertEvaluatorConfig & {
    /** The  provider used to interact with the evm-chain. */
    provider: ethers.providers.Provider;
    /** The URL of the RPC endpoint used to interact with the evm-chain. */
    rpcUrl?: string;
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
  /** The Ethereum signer used to sign transactions. */
  signer: ethers.Signer;
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
  /** The contract used by the client. */
  contract: HypercertMinter;
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
   * @returns A Promise that resolves to the transaction receipt
   */
  mintClaim: (
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => Promise<ContractTransaction>;

  /**
   * Creates a new allowlist and mints a new claim with the allowlist.
   * @param allowList The allowlist for the claim.
   * @param metaData The metadata for the claim.
   * @param totalUnits The total number of units for the claim.
   * @param transferRestriction The transfer restriction for the claim.
   * @returns A Promise that resolves to the transaction receipt
   */
  createAllowlist: (
    allowList: Allowlist,
    metaData: HypercertMetadata,
    totalUnits: BigNumberish,
    transferRestriction: TransferRestrictions,
  ) => Promise<ContractTransaction>;

  /**
   * Splits a claim into multiple fractions.
   * @param claimId The ID of the claim to split.
   * @param fractions The number of units for each fraction.
   * @returns A Promise that resolves to the transaction receipt
   */
  splitClaimUnits: (claimId: BigNumberish, fractions: BigNumberish[]) => Promise<ContractTransaction>;

  /**
   * Merges multiple claim fractions into a single claim.
   * @param claimIds The IDs of the claim fractions to merge.
   * @returns A Promise that resolves to the transaction receipt
   */
  mergeClaimUnits: (claimIds: BigNumberish[]) => Promise<ContractTransaction>;

  /**
   * Burns a claim fraction.
   * @param claimId The ID of the claim fraction to burn.
   * @returns A Promise that resolves to the transaction receipt
   */
  burnClaimFraction: (claimId: BigNumberish) => Promise<ContractTransaction>;

  /**
   * Mints a claim fraction from an allowlist.
   * @param claimId The ID of the claim to mint a fraction for.
   * @param units The number of units for the fraction.
   * @param proof The Merkle proof for the allowlist.
   * @returns A Promise that resolves to the transaction receipt
   */
  mintClaimFractionFromAllowlist: (
    claimId: BigNumberish,
    units: BigNumberish,
    proof: BytesLike[],
  ) => Promise<ContractTransaction>;
}
