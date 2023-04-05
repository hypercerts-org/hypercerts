import { ethers } from "ethers";

import { UnsupportedChain } from "./errors.js";

/**
 * Constants
 */
// Goerli is default if nothing specified
const DEFAULT_CHAIN_ID = 5;
// These are the deployments we manage
const DEPLOYMENTS: Deployment[] = [
  {
    chainId: 5,
    chainName: "goerli",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    graphName: "hypercerts-testnet",
  },
  {
    chainId: 10,
    chainName: "optimism-mainnet",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    graphName: "hypercerts-optimism-mainnet",
  },
];
type SupportedChainIds = 5 | 10;
const SUPPORTED_CHAIN_IDS: SupportedChainIds[] = [5, 10];
type SupportedChainNames = "goerli" | "optimism-mainnet";

interface Deployment {
  chainId: SupportedChainIds;
  chainName: SupportedChainNames;
  contractAddress: string;
  graphName: "hypercerts-testnet" | "hypercerts-optimism-mainnet";
}

export type Config = Deployment & {
  rpcUrl: string;
};

export const getConfig = (overrides: Partial<Config>) => {
  // Get the chainId, first from overrides, then environment variables, then the constant
  const chainId =
    overrides.chainId ??
    (process.env.DEFAULT_CHAIN_ID ? parseInt(process.env.DEFAULT_CHAIN_ID || "") : DEFAULT_CHAIN_ID);

  if (chainId !== 5 && chainId !== 10) {
    throw new UnsupportedChain(`chainId=${chainId} is not yet supported`);
  }

  const baseDeployment = DEPLOYMENTS.find((d) => d.chainId === chainId);
  if (!baseDeployment) {
    throw new UnsupportedChain(`chainId=${chainId} is missing in SDK`);
  }

  const config = {
    // Start with the hardcoded values
    ...baseDeployment,
    // Let the user override from environment variables
    ...(process.env.DEFAULT_CHAIN ? { chainId: parseInt(process.env.DEFAULT_CHAIN_ID || "") } : {}),
    ...(process.env.CONTRACT_ADDRESS ? { contractAddress: process.env.CONTRACT_ADDRESS } : {}),
    ...(process.env.RPC_URL ? { rpcUrl: process.env.RPC_URL } : {}),
    // Let the user override from explicit parameters
    ...overrides,
    chainId: chainId,
  };

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      console.error(`Cannot get chain config. ${key} is possibly undefined`);
    }
  }

  return config;
};
