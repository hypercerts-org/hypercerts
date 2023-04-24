import { UnsupportedChainError } from "./types/errors.js";
import { logger } from "./utils/logger.js";
import { DEFAULT_CHAIN_ID, DEPLOYMENTS } from "./constants.js";
import { HypercertClientConfig } from "./types/client.js";

/**
 * Get the configuration for the SDK
 * @param overrides
 * @returns Config
 */
export const getConfig = (overrides: Partial<HypercertClientConfig>) => {
  // Get the chainId, first from overrides, then environment variables, then the constant
  const chainId =
    overrides.chainId ??
    (process.env.DEFAULT_CHAIN_ID ? parseInt(process.env.DEFAULT_CHAIN_ID || "") : DEFAULT_CHAIN_ID);

  if (chainId !== 5 && chainId !== 10) {
    throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, chainId);
  }

  const baseDeployment = DEPLOYMENTS[chainId];
  if (!baseDeployment) {
    throw new UnsupportedChainError(`chainId=${chainId} is missing in SDK`, chainId);
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
  } as HypercertClientConfig;

  if (overrides.signer?._isSigner) {
    config.signer = overrides.signer;
  }

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      logger.error(`Cannot get chain config. ${key} is possibly undefined`);
    }
  }

  return config;
};
