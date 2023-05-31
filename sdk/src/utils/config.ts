import { UnsupportedChainError } from "../types/errors.js";
import { DEFAULT_CHAIN_ID, DEPLOYMENTS } from "../constants.js";
import { HypercertClientConfig } from "../types/client.js";
import { ethers } from "ethers";
import logger from "./logger.js";
import { isAddress } from "ethers/lib/utils.js";

/**
 * Get the configuration for the SDK
 * @param overrides
 * @returns Config
 */
export const getConfig = (overrides: Partial<HypercertClientConfig>) => {
  // Get the chainId, first from overrides, then environment variables, then the constant
  const { chainId } = getChainId(overrides);

  if (!chainId || (chainId !== 5 && chainId !== 10)) {
    throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, chainId || "not found");
  }

  const baseDeployment = DEPLOYMENTS[chainId];
  if (!baseDeployment) {
    throw new UnsupportedChainError(`chainId=${chainId} is missing in SDK`, chainId);
  }

  const config = {
    // Start with the hardcoded values
    ...baseDeployment,
    // Let the user override from environment variables
    ...getChainId(overrides),
    ...getChainName(overrides),
    ...getContractAddress(overrides),
    ...getRpcUrl(overrides),
    ...getGraphName(overrides),
    ...getProvider(overrides),
    ...getSigner(overrides),
    ...getNftStorageToken(overrides),
    ...getWeb3StorageToken(overrides),
  } as HypercertClientConfig;

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      logger.warn(`Cannot get chain config. ${key} is possibly undefined`);
    }
  }

  return config;
};

const getChainId = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides?.chainId) {
    return { chainId: overrides.chainId };
  }

  return process.env.DEFAULT_CHAIN_ID
    ? { chainId: parseInt(process.env.DEFAULT_CHAIN_ID) }
    : { chainId: DEFAULT_CHAIN_ID };
};

const getChainName = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.chainName) {
    return { chainName: overrides.chainName };
  }

  const { chainId } = getChainId(overrides);
  switch (chainId) {
    case 5:
      return { chainName: "goerli" };
    case 10:
      return { chainName: "optimism-mainnet" };
    default:
      throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, chainId?.toString() || "undefined");
  }
};

const getContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.contractAddress) {
    return { contractAddress: overrides.contractAddress };
  }
  return process.env.CONTRACT_ADDRESS ? { contractAddress: process.env.CONTRACT_ADDRESS } : undefined;
};

const getRpcUrl = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.rpcUrl) {
    return { rpcUrl: overrides.rpcUrl };
  }
  return process.env.RPC_URL ? { rpcUrl: process.env.RPC_URL } : {};
};

const getGraphName = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.graphName) {
    return { graphName: overrides.graphName };
  }

  const { chainId } = getChainId(overrides);
  switch (chainId) {
    case 5:
      return { graphName: "hypercerts-testnet" };
    case 10:
      return { chainName: "hypercerts-optimism-mainnet" };
    default:
      throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, chainId?.toString() || "undefined");
  }
};

const getProvider = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.provider) {
    return { provider: overrides.provider };
  }

  const { rpcUrl } = getRpcUrl(overrides);
  return rpcUrl
    ? { provider: new ethers.providers.JsonRpcProvider(rpcUrl) }
    : { provider: ethers.getDefaultProvider("goerli") };
};

const getSigner = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.signer?._isSigner) {
    return { signer: overrides.signer };
  }

  return process.env.PRIVATE_KEY
    ? { signer: new ethers.Wallet(process.env.PRIVATE_KEY) }
    : { signer: new ethers.VoidSigner("") };
};

const getNftStorageToken = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.nftStorageToken) {
    return { nftStorageToken: overrides.nftStorageToken };
  }

  if (process.env.NFT_STORAGE_TOKEN) {
    return { nftStorageToken: process.env.NFT_STORAGE_TOKEN };
  }

  if (process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN) {
    return { nftStorageToken: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN };
  }

  return {};
};

const getWeb3StorageToken = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.web3StorageToken) {
    return { web3StorageToken: overrides.web3StorageToken };
  }

  if (process.env.WEB3_STORAGE_TOKEN) {
    return { web3StorageToken: process.env.WEB3_STORAGE_TOKEN };
  }

  if (process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN) {
    return { web3StorageToken: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN };
  }

  return {};
};
