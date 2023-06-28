import {
  Deployment,
  HypercertClientConfig,
  UnsupportedChainError,
  SupportedChainIds,
  ConfigurationError,
} from "../types/index.js";
import { DEFAULT_CHAIN_ID, DEPLOYMENTS } from "../constants.js";
import { ethers } from "ethers";
import logger from "./logger.js";

/**
 * Returns the configuration for the Hypercert client, based on the given overrides.
 * @param overrides An object containing overrides for the default configuration.
 * @returns The configuration for the Hypercert client.
 * @throws An `UnsupportedChainError` if the chain ID is not 5 or 10, or if the chain ID is missing or not found.
 */
export const getConfig = (overrides: Partial<HypercertClientConfig>) => {
  // Get the chainId, first from overrides, then environment variables, then the constant
  const { chainId } = getChainId(overrides);

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
    if (!chainId || [5, 10].indexOf(chainId) === -1) {
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

  let config = {
    // Start with the hardcoded values
    ...baseDeployment,
    // Let the user override from environment variables
    ...getChainId(overrides),
    ...getChainName(overrides),
    ...getContractAddress(overrides),
    ...getRpcUrl(overrides),
    ...getGraphConfig(overrides),
    ...getProvider(overrides),
    ...getSigner(overrides),
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
      throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, {
        chainID: chainId?.toString() || "undefined",
      });
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

const getGraphConfig = (overrides: Partial<HypercertClientConfig>) => {
  let config = {
    graphUrl: "",
  };
  if (overrides.unsafeForceOverrideConfig) {
    if (!overrides.graphUrl) {
      throw new ConfigurationError("A graphUrl must be specified when overriding configuration");
    }
    config.graphUrl = overrides.graphUrl;
    return config;
  }

  const { chainId } = getChainId(overrides);
  switch (chainId) {
    case 5:
      config.graphUrl = DEPLOYMENTS[5].graphUrl;
      return config;
    case 10:
      config.graphUrl = DEPLOYMENTS[10].graphUrl;
      return config;
    default:
      throw new UnsupportedChainError(`chainId=${chainId} is not yet supported`, {
        chainID: chainId?.toString() || "undefined",
      });
  }
};

const getProvider = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.provider) {
    return { provider: overrides.provider };
  }

  const { rpcUrl } = getRpcUrl(overrides);

  const provider = rpcUrl ? new ethers.providers.JsonRpcProvider(rpcUrl, "any") : ethers.getDefaultProvider("goerli");

  provider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network

    if (typeof window === "undefined") return;
    if (oldNetwork && window.location) {
      window.location.reload();
    }
  });

  return { provider };
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

const getEasContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.easContractAddress) {
    return { easContractAddress: overrides.easContractAddress };
  }

  return { easContractAddress: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e" };
};
