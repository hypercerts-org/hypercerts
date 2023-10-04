import { ethers } from "ethers";
import { isAddress } from "ethers/lib/utils.js";

import { DEFAULT_CHAIN_ID, DEPLOYMENTS } from "../constants.js";
import {
  ConfigurationError,
  Deployment,
  HypercertClientConfig,
  InvalidOrMissingError,
  SupportedChainIds,
  UnsupportedChainError,
} from "../types/index.js";
import logger from "./logger.js";

/**
 * Returns the configuration for the Hypercert client, based on the given overrides.
 * @param overrides An object containing overrides for the default configuration.
 * @returns The configuration for the Hypercert client.
 * @throws An `UnsupportedChainError` if the chain ID is not 5 or 10, or if the chain ID is missing or not found.
 */
export const getConfig = (overrides: Partial<HypercertClientConfig>) => {
  // Get the chainId, first from overrides, then environment variables, then the constant
  const { chainId } = getChainConfig(overrides);

  let baseDeployment: Deployment & { unsafeForceOverrideConfig?: boolean };

  if (overrides.unsafeForceOverrideConfig) {
    if (!overrides.chainName || !overrides.contractAddress || !overrides.graphUrl) {
      throw new UnsupportedChainError(
        `attempted to override with chainId=${chainId}, but requires chainName, graphUrl, and contractAddress to be set`,
        { chainID: chainId?.toString() || "undefined" },
      );
    }
    baseDeployment = {
      chainId: chainId,
      chainName: overrides.chainName,
      contractAddress: overrides.contractAddress,
      graphUrl: overrides.graphUrl,
      unsafeForceOverrideConfig: overrides.unsafeForceOverrideConfig,
    };
  } else {
    if (!chainId || [5, 10, 11155111].indexOf(chainId) === -1) {
      throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, {
        chainID: chainId?.toString() || "undefined",
      });
    }

    baseDeployment = DEPLOYMENTS[chainId as SupportedChainIds];
    if (!baseDeployment) {
      throw new UnsupportedChainError(`Default config for chainId=${chainId} is missing in SDK`, {
        chainID: chainId,
      });
    }
  }

  const config = {
    // Start with the hardcoded values
    ...baseDeployment,
    // Let the user override from environment variables
    ...getChainConfig(overrides),
    ...getOperator(overrides),
    ...getContractAddress(overrides),
    ...getGraphUrl(overrides),
    ...getNftStorageToken(overrides),
    ...getWeb3StorageToken(overrides),
    ...getEasContractAddress(overrides),
  } as HypercertClientConfig;

  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      logger.warn(`Cannot get chain config. ${key} is possibly undefined`);
    }
  }

  return config;
};

const getChainConfig = (overrides: Partial<HypercertClientConfig>) => {
  const chainId =
    overrides?.chainId ?? (process.env.DEFAULT_CHAIN_ID ? parseInt(process.env.DEFAULT_CHAIN_ID) : DEFAULT_CHAIN_ID);
  let chainName: string;

  switch (chainId) {
    case 5:
      chainName = "goerli";
      break;
    case 10:
      chainName = "optimism-mainnet";
      break;
    case 11155111:
      chainName = "sepolia";
      break;
    default:
      chainName = overrides?.chainName ?? "";
      if (!chainName) {
        throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, {
          chainID: chainId?.toString() || "undefined",
        });
      }
  }

  return { chainId, chainName };
};

const getContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.contractAddress) {
    if (!isAddress(overrides.contractAddress)) {
      throw new InvalidOrMissingError("Invalid contract address.", { contractAddress: overrides.contractAddress });
    }
    return { contractAddress: overrides.contractAddress };
  }
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (contractAddress && !isAddress(contractAddress)) {
    throw new InvalidOrMissingError("Invalid contract address.", { contractAddress });
  }
  return contractAddress ? { contractAddress } : undefined;
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

  const { chainId } = getChainConfig(overrides);

  graphUrl = DEPLOYMENTS[chainId as keyof typeof DEPLOYMENTS].graphUrl ?? process.env.GRAPH_URL;
  if (!graphUrl) {
    throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, {
      chainID: chainId?.toString() || "undefined",
    });
  }
  try {
    new URL(graphUrl);
  } catch (error) {
    throw new ConfigurationError("Invalid graph URL", { graphUrl });
  }

  return { graphUrl };
};

const getOperator = (overrides: Partial<HypercertClientConfig>) => {
  let operator: ethers.Signer | ethers.providers.Provider;

  if (
    overrides.operator &&
    !(overrides.operator instanceof ethers.Signer) &&
    !(overrides.operator instanceof ethers.providers.Provider)
  ) {
    throw new InvalidOrMissingError("Invalid operator.", { operator: overrides.operator });
  }

  if (overrides.operator instanceof ethers.Signer) {
    operator = overrides.operator;
  } else if (overrides.operator instanceof ethers.providers.Provider) {
    operator = overrides.operator;
    operator.on("network", (newNetwork, oldNetwork) => {
      // When a Provider makes its initial connection, it emits a "network"
      // event with a null oldNetwork along with the newNetwork. So, if the
      // oldNetwork exists, it represents a changing network

      if (typeof window === "undefined") return;
      if (oldNetwork && window.location) {
        window.location.reload();
      }
    });
  } else if (process.env.PRIVATE_KEY) {
    const provider = ethers.getDefaultProvider(DEFAULT_CHAIN_ID);
    operator = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  } else {
    operator = ethers.getDefaultProvider(DEFAULT_CHAIN_ID);
  }

  return { operator };
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

const getEasContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.easContractAddress) {
    return { easContractAddress: overrides.easContractAddress };
  }

  return { easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e" };
};
