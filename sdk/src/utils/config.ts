import { sepolia, goerli, optimism, celo, Chain } from "viem/chains";

import { DEPLOYMENTS } from "../constants";
import {
  ConfigurationError,
  Deployment,
  HypercertClientConfig,
  InvalidOrMissingError,
  SupportedChainIds,
  UnsupportedChainError,
} from "../types";
import { logger } from "./logger";
import { createPublicClient, http, isAddress } from "viem";
import { deployments } from "../../src";

/**
 * Returns a configuration object for the Hypercert client.
 *
 * This function first retrieves the chain configuration, then checks if there are any overrides provided. If the `unsafeForceOverrideConfig` flag is set,
 * it validates the overrides and uses them to create the base deployment configuration. If the flag is not set, it retrieves the deployment configuration
 * for the provided chain ID or the default chain ID. It then merges the base deployment configuration with the overrides and the values retrieved from
 * environment variables to create the final configuration object. If any required properties are missing, it logs a warning.
 *
 * Current supported chain IDs are:
 * - 5: Goerli
 * - 10: Optimism
 * - 42220: Celo
 * - 11155111: Sepolia
 *
 * @param {Partial<HypercertClientConfig>} overrides - An object containing any configuration values to override. This should be a partial HypercertClientConfig object.
 * @returns {Partial<HypercertClientConfig>} The final configuration object for the Hypercert client.
 * @throws {InvalidOrMissingError} Will throw an `InvalidOrMissingError` if the `unsafeForceOverrideConfig` flag is set but the required overrides are not provided.
 * @throws {UnsupportedChainError} Will throw an `UnsupportedChainError` if the default configuration for the provided chain ID is missing.
 */
export const getConfig = (overrides: Partial<HypercertClientConfig>): Partial<HypercertClientConfig> => {
  // Get the chainId, first from overrides, then environment variables, then the constant
  const chain = getChainConfig(overrides);
  if (!chain) {
    logger.warn("[getConfig]: No default config for chain found");
  }

  let baseDeployment: (Partial<Deployment> & { unsafeForceOverrideConfig?: boolean }) | undefined;

  if (overrides.unsafeForceOverrideConfig) {
    if (!overrides.chain?.id || !overrides.contractAddress || !overrides.graphUrl) {
      throw new InvalidOrMissingError(
        `attempted to override with chainId=${overrides.chain?.id}, but requires chainName, graphUrl, and contractAddress to be set`,
        {
          chainID: overrides.chain?.id?.toString(),
          graphUrl: overrides.graphUrl,
          contractAddress: overrides.contractAddress,
        },
      );
    }
    baseDeployment = {
      chain: { ...chain, id: overrides.chain?.id },
      contractAddress: overrides.contractAddress,
      graphUrl: overrides.graphUrl,
      unsafeForceOverrideConfig: overrides.unsafeForceOverrideConfig,
    };
  } else {
    //TODO doo many casts
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
    ...getContractAddress(overrides),
    ...getGraphUrl(overrides),
    ...getNftStorageToken(overrides),
    ...getWeb3StorageToken(overrides),
    ...getEasContractAddress(overrides),
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
  return deployments[chainId];
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

const getContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.contractAddress) {
    if (!isAddress(overrides.contractAddress)) {
      throw new InvalidOrMissingError("Invalid contract address.", { contractAddress: overrides.contractAddress });
    }
    return { contractAddress: overrides.contractAddress };
  }
};

const getGraphUrl = (overrides: Partial<HypercertClientConfig>) => {
  let graphUrl;
  if (overrides.unsafeForceOverrideConfig) {
    if (!overrides.graphUrl) {
      throw new ConfigurationError("A graphUrl must be specified when overriding configuration");
    }
    try {
      new URL(overrides.graphUrl);
    } catch (error) {
      throw new ConfigurationError("Invalid graph URL", { graphUrl: overrides.graphUrl });
    }
    graphUrl = overrides.graphUrl;
    return { graphUrl };
  }

  const chain = getChainConfig(overrides);

  graphUrl = DEPLOYMENTS[chain?.id as keyof typeof DEPLOYMENTS].graphUrl ?? process.env.GRAPH_URL;
  if (!graphUrl) {
    throw new UnsupportedChainError(`No Graph URL found in deployments or env vars`, {
      chainID: chain?.toString(),
    });
  }
  try {
    new URL(graphUrl);
  } catch (error) {
    throw new ConfigurationError("Invalid graph URL", { graphUrl });
  }

  return { graphUrl };
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

export const getNftStorageToken = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.nftStorageToken) {
    return { nftStorageToken: overrides.nftStorageToken };
  }
};

export const getWeb3StorageToken = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.web3StorageToken) {
    return { web3StorageToken: overrides.web3StorageToken };
  }
};

const getEasContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  return { easContractAddress: overrides.easContractAddress };
};

const getDefaultChain = (chainId: number) => {
  const _chains = [sepolia, goerli, optimism, celo];

  for (const chain of Object.values(_chains)) {
    if ("id" in chain) {
      if (chain.id === chainId) {
        return chain as Chain;
      }
    }
  }
};
