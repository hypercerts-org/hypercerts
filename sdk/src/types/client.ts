import type { TypedDataSigner } from "@ethersproject/abstract-signer";
import { HypercertMinter } from "@hypercerts-org/contracts";
import { BigNumberish, BytesLike, ContractTransaction, ethers } from "ethers";
import { CIDString } from "nft.storage";
import HypercertEvaluator from "src/evaluations/index.js";
import HypercertsStorage from "src/storage.js";

import { Allowlist, TransferRestrictions } from "./hypercerts.js";
import { HypercertMetadata } from "./metadata.js";
import HypercertIndexer from "src/indexer.js";

export type SupportedChainIds = 5 | 10;

export type Deployment = {
  chainId: number;
  chainName: string;
  contractAddress: string;
  graphName: string;
};

export type HypercertClientConfig = Deployment &
  HypercertStorageConfig & {
    provider: ethers.providers.Provider;
    signer: ethers.Signer & TypedDataSigner;
    rpcUrl?: string;
  };

/**
 * Hypercerts storage configuration
 * @param nftStorageToken - NFT Storage token
 * @param web3StorageToken - Web3 Storage token
 */
export type HypercertStorageConfig = {
  nftStorageToken?: string;
  web3StorageToken?: string;
};

/**
 * Hypercerts storage interface
 * @dev getting and storing data handles unknown types and should be executed with care
 * @param storeMetadata - Store metadata on IPFS
 * @param getMetadata - Get metadata from IPFS
 * @param storeData - Store data on IPFS
 * @param getData - Get data from IPFS
 */
export interface HypercertStorageInterface {
  storeMetadata: (metadata: HypercertMetadata) => Promise<CIDString>;
  getMetadata: (cidOrIpfsUri: string) => Promise<HypercertMetadata>;
  storeData: (data: unknown) => Promise<CIDString>;
  getData: (cidOrIpfsUri: string) => Promise<unknown>;
}

/**
 * Hypercerts client configuration
 * @param config - Hypercerts client configuration
 * @param storage - Hypercerts storage configuration
 */
export type HypercertClientProps = {
  config?: Partial<HypercertClientConfig>;
};

export interface HypercertClientInterface extends HypercertClientMethods, HypercertClientState {}

/**
 * Hypercerts client state
 * @param readonly - Indicates if the client is readonly
 * @param config - Hypercerts client configuration
 * @param provider - Ethers provider
 * @param contract - Hypercerts contract
 * @param indexer - Hypercerts indexer
 * @param storage - Hypercerts storage
 * @param evaluator - Hypercerts
 */
export interface HypercertClientState {
  readonly: boolean;
  storage: HypercertsStorage;
  indexer: HypercertIndexer;
}

/**
 * Hypercerts client methods
 * @param storage - Hypercerts storage getter
 * @param indexer - Hypercerts indexer getter
 * @param mintClaim - Wrapper function to mint a Hypercert claim
 * @param createAllowlist - Wrapper function to mint a Hypercert claim with an allowlist
 * @param splitClaimUnits - Wrapper function to split a Hypercert claim into multiple claims
 * @param mergeClaimUnits - Wrapper function to merge multiple Hypercert claims into one
 * @param burnClaimFraction - Wrapper function to burn a fraction of a Hypercert claim
 * @param mintClaimFractionFromAllowlist - Wrapper function to mint a fraction of a Hypercert claim from an allowlist
 */
export interface HypercertClientMethods {
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
  mintClaimFractionFromAllowlist: (
    claimId: BigNumberish,
    units: BigNumberish,
    proof: BytesLike[],
  ) => Promise<ContractTransaction>;
}
