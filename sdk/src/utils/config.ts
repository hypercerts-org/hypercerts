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
import logger from "./logger";
import { createPublicClient, http, isAddress } from "viem";
import { deployments } from "../../src";

/**
 * Returns the configuration for the Hypercert client, based on the given overrides.
 * @param config An object containing overrides for the default configuration.
 * @returns The configuration for the Hypercert client.
 * @throws An `ConfigurationError` if the `environment` in `config` is not a supported environment, or if the chain ID was not found.
 * @dev 5, 10, 42220, 11155111 and "test", "production" are supported environments.
 * Test and production merge the Graphs by environment, while the chain IDs are specific to the chain.
 */
export const getConfig = (overrides: Partial<HypercertClientConfig>) => {
  // Get the chainId, first from overrides, then environment variables, then the constant
  const chain = getChainConfig(overrides);
  if (!chain) {
    logger.warn("[getConfig]: No default config for chain found");
  }

  let baseDeployment: (Partial<Deployment> & { unsafeForceOverrideConfig?: boolean }) | undefined;

  if (overrides.unsafeForceOverrideConfig) {
    if (!overrides.id || !overrides.contractAddress || !overrides.graphUrl) {
      throw new InvalidOrMissingError(
        `attempted to override with chainId=${overrides.id}, but requires chainName, graphUrl, and contractAddress to be set`,
        {
          chainID: overrides.id?.toString(),
          graphUrl: overrides.graphUrl,
          contractAddress: overrides.contractAddress,
        },
      );
    }
    baseDeployment = {
      ...chain,
      id: overrides.id,
      contractAddress: overrides.contractAddress,
      graphUrl: overrides.graphUrl,
      unsafeForceOverrideConfig: overrides.unsafeForceOverrideConfig,
    };
  } else {
    //TODO doo many casts
    baseDeployment = overrides.id
      ? (getDeployment(overrides.id as SupportedChainIds) as Partial<Deployment> & {
          unsafeForceOverrideConfig?: boolean;
        })
      : chain?.id
      ? (getDeployment(chain.id as SupportedChainIds) as Partial<Deployment> & { unsafeForceOverrideConfig?: boolean })
      : undefined;
    if (!baseDeployment) {
      throw new UnsupportedChainError(`Default config for chainId=${overrides.id} is missing in SDK`, {
        chainID: overrides.id,
      });
    }

    baseDeployment = { ...chain, ...baseDeployment };
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
  const chainId = overrides?.id
    ? overrides.id
    : process.env.DEFAULT_CHAIN_ID
    ? parseInt(process.env.DEFAULT_CHAIN_ID)
    : undefined;

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

  if (process.env.NFT_STORAGE_TOKEN) {
    return { nftStorageToken: process.env.NFT_STORAGE_TOKEN };
  }

  if (process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN) {
    return { nftStorageToken: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN };
  }

  return {};
};

export const getWeb3StorageToken = (overrides: Partial<HypercertClientConfig>) => {
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
