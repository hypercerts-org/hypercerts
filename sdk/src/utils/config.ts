import { sepolia, optimism, celo, Chain, baseSepolia, base } from "viem/chains";

import { DEFAULT_INDEXER_ENVIRONMENT } from "../constants";
import {
  ConfigurationError,
  Deployment,
  HypercertClientConfig,
  InvalidOrMissingError,
  SupportedChainIds,
  UnsupportedChainError,
} from "../types";
import { logger } from "./logger";
import { createPublicClient, http } from "viem";
import { DEPLOYMENTS } from "../constants";

/**
 * Returns a configuration object for the Hypercert client.
 *
 * This function first retrieves the chain configuration, then checks if there are any overrides provided. If the `unsafeForceOverrideConfig` flag is set,
 * it validates the overrides and uses them to create the base deployment configuration. If the flag is not set, it retrieves the deployment configuration
 * for the provided chain ID or the default chain ID. It then merges the base deployment configuration with the overrides and the values retrieved from
 * environment variables to create the final configuration object. If any required properties are missing, it logs a warning.
 *
 * Current supported chain IDs are:
 * - 10: Optimism
 * - 42220: Celo
 * - 11155111: Sepolia
 * - 84532: Base Sepolia
 * - 8453: Base Mainnet
 *
 * @param {Partial<HypercertClientConfig>} overrides - An object containing any configuration values to override. This should be a partial HypercertClientConfig object.
 * @returns {Partial<HypercertClientConfig>} The final configuration object for the Hypercert client.
 * @throws {InvalidOrMissingError} Will throw an `InvalidOrMissingError` if the `unsafeForceOverrideConfig` flag is set but the required overrides are not provided.
 * @throws {UnsupportedChainError} Will throw an `UnsupportedChainError` if the default configuration for the provided chain ID is missing.
 */
export const getConfig = (overrides: Partial<HypercertClientConfig>): Partial<HypercertClientConfig> => {
  // Get the chainId of the writing chain, first from overrides, then environment variables, then the constant
  const chain = getChainConfig(overrides);
  if (!chain) {
    logger.warn("[getConfig]: No default config for chain found");
  }

  let baseDeployment: (Partial<Deployment> & { unsafeForceOverrideConfig?: boolean }) | undefined;

  if (overrides.unsafeForceOverrideConfig) {
    if (!overrides.chain?.id) {
      throw new InvalidOrMissingError(
        `attempted to override with chainId=${overrides.chain?.id}, but requires chainName, graphUrl, and contractAddress to be set`,
        {
          chainID: overrides.chain?.id?.toString(),
        },
      );
    }
    baseDeployment = {
      chain: { ...chain, id: overrides.chain?.id },
      unsafeForceOverrideConfig: overrides.unsafeForceOverrideConfig,
    };
  } else {
    //TODO do many casts
    baseDeployment = overrides.chain?.id
      ? (getDeployment(overrides.chain?.id as SupportedChainIds) as Partial<Deployment> & {
          unsafeForceOverrideConfig?: boolean;
        })
      : chain?.id
      ? (getDeployment(chain.id as SupportedChainIds) as Partial<Deployment> & { unsafeForceOverrideConfig?: boolean })
      : undefined;
    if (!baseDeployment) {
      throw new UnsupportedChainError(`Default config for chainId=${overrides.chain?.id} is missing in SDK`, {
        chainID: overrides.chain?.id,
      });
    }

    baseDeployment = { ...baseDeployment, chain };
  }

  const config: Partial<HypercertClientConfig> = {
    // Start with the hardcoded values
    ...baseDeployment,
    // Let the user override from environment variables
    ...getWalletClient(overrides),
    ...getPublicClient(overrides),
    ...getEasContractAddress(overrides),
    ...getIndexerEnvironment(overrides),
  };

  const missingKeys = [];

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) logger.warn(`Missing properties in config: ${missingKeys.join(", ")}`);

  return config;
};

const getDeployment = (chainId: SupportedChainIds) => {
  return DEPLOYMENTS[chainId];
};

const getIndexerEnvironment = (overrides: Partial<HypercertClientConfig>) => {
  return { indexerEnvironment: overrides.indexerEnvironment || DEFAULT_INDEXER_ENVIRONMENT };
};

const getChainConfig = (overrides: Partial<HypercertClientConfig>) => {
  const chainId = overrides?.chain?.id ? overrides.chain?.id : undefined;

  if (!chainId) {
    throw new ConfigurationError("No chainId specified in config or environment variables");
  }

  const chain = getDefaultChain(chainId);

  if (!chain) {
    throw new UnsupportedChainError(`No default config for chainId=${chainId} found in SDK`, {
      chainID: chainId?.toString(),
    });
  }

  return chain;
};

const getWalletClient = (overrides: Partial<HypercertClientConfig>) => {
  const walletClient = overrides.walletClient;

  if (!walletClient) {
    logger.warn("No wallet client found", "getWalletClient", walletClient);
  }

  return { walletClient };
};

const getPublicClient = (overrides: Partial<HypercertClientConfig>) => {
  const chain = getChainConfig(overrides);
  let publicClient;

  publicClient = createPublicClient({
    chain: chain,
    transport: http(),
  });

  if (overrides.publicClient) {
    publicClient = overrides.publicClient;
  }

  return { publicClient };
};

const getEasContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  return { easContractAddress: overrides.easContractAddress };
};

const getDefaultChain = (chainId: number) => {
  const _chains = [sepolia, optimism, celo, base, baseSepolia];

  for (const chain of Object.values(_chains)) {
    if ("id" in chain) {
      if (chain.id === chainId) {
        return chain as Chain;
      }
    }
  }
};
