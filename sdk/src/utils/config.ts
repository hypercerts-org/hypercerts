import { ethers } from "ethers";

import { DEPLOYMENTS } from "../constants";
import {
  ConfigurationError,
  HypercertClientConfig,
  InvalidOrMissingError,
  Operator,
  SupportedChainIds,
  UnsupportedChainError,
} from "../types";
import logger from "./logger";

/**
 * Returns the configuration for the Hypercert client, based on the given overrides.
 * @param overrides An object containing overrides for the default configuration.
 * @returns The configuration for the Hypercert client.
 * @throws An `UnsupportedChainError` if the chain ID is not 5 or 10, or if the chain ID is missing or not found.
 */
export const getReadOnlyConfig = (config: Partial<HypercertClientConfig>) => {
  let deployment;
  const readOnly = true;
  const readOnlyReason = "No signer provided";

  // Need to get an environment to initialize the SDK
  if (!config.environment) {
    throw new ConfigurationError(
      "An environment must be specified. For example, 'test', 'production' or a supported chainId.",
    );
  }

  // Configure for a specific chain based on chainID in environment or overrides (if provided)
  if (config.environment !== "test" && config.environment !== "production") {
    deployment = DEPLOYMENTS[config.environment as SupportedChainIds];

    // If the config provided enables unsafeForceOverrideConfig, we can use that to get the deployment
    if (config.unsafeForceOverrideConfig) {
      if (!config.chainId || !config.chainName || !config.contractAddress || !config.graphUrl) {
        throw new UnsupportedChainError(
          `attempted to override with chainId=${config.chainId}, but requires chainName, graphUrl, and contractAddress to be set`,
          { chainID: config.chainId?.toString() || "undefined" },
        );
      }
      deployment = {
        chainId: config.chainId,
        chainName: config.chainName,
        contractAddress: config.contractAddress,
        graphUrl: config.graphUrl,
        unsafeForceOverrideConfig: config.unsafeForceOverrideConfig,
      };
    }
  }

  const _config = {
    ...config,
    // Start with the hardcoded values
    ...deployment,
    // Let the user override from environment variables
    ...getGraphUrl(config),
    nftStorageToken: getNftStorageToken(config),
    web3StorageToken: getWeb3StorageToken(config),
    easContractAddress: getEasContractAddress(config),
    readOnly,
    readOnlyReason,
  } as HypercertClientConfig;

  checkOnMissingValues(_config);

  return _config;
};

/**
 * Returns the configuration for the Hypercert client, based on the given overrides.
 * @param overrides An object containing overrides for the default configuration.
 * @returns The configuration for the Hypercert client.
 * @throws An `UnsupportedChainError` if the chain ID is not 5 or 10, or if the chain ID is missing or not found.
 */
export const getWritableConfig = async (config: Partial<HypercertClientConfig>) => {
  let deployment;
  let readOnly = true;
  let readOnlyReason: string | undefined = "No signer provided";

  // Need to get an environment to initialize the SDK
  if (!config.environment) {
    throw new ConfigurationError(
      "An environment must be specified. For example, 'test', 'production' or a supported chainId.",
    );
  }

  // If we know the chainID from the operator or the config, we can use that to get the deployment
  const chainId = await getChaindId(config?.operator);

  if (!chainId) {
    readOnly = true;
    readOnlyReason = "Could not get chainId from operator";
  }

  // If the chainId from environment and the operator are different, set to readOnly according to the environment chainID
  if (chainId && chainId !== config.environment) {
    deployment = DEPLOYMENTS[config.environment as SupportedChainIds];
    readOnly = true;
    readOnlyReason = `ChainID mismatch between signer ${chainId} and configured environment ${config.environment}`;
  } else if (chainId && chainId === config.environment) {
    deployment = DEPLOYMENTS[chainId as SupportedChainIds];
    readOnly = false;
    readOnlyReason = undefined;
  }

  // If the config provided enables unsafeForceOverrideConfig, we can use that to get the deployment
  if (config.unsafeForceOverrideConfig) {
    if (!config.chainId || !config.chainName || !config.contractAddress || !config.graphUrl) {
      throw new UnsupportedChainError(
        `attempted to override with chainId=${config.chainId}, but requires chainName, graphUrl, and contractAddress to be set`,
        { chainID: config.chainId?.toString() || "undefined" },
      );
    }
    deployment = {
      chainId: config.chainId,
      chainName: config.chainName,
      contractAddress: config.contractAddress,
      graphUrl: config.graphUrl,
      unsafeForceOverrideConfig: config.unsafeForceOverrideConfig,
    };
  }

  // TODO execute validations
  // else {
  //   if (!Object.values(SupportedChainIds).includes(deployment?.chainId as SupportedChainIds)) {
  //     throw new UnsupportedChainError(`Default config for chainId=${deployment?.chainId} is missing in SDK`, {
  //       chainID: deployment?.chainId,
  //     });
  //   }
  // }
  //

  const _config = {
    ...config,
    // Start with the hardcoded values
    ...deployment,
    // Let the user override from environment variables
    ...getOperator(config),
    ...getGraphUrl(config),
    nftStorageToken: getNftStorageToken(config),
    web3StorageToken: getWeb3StorageToken(config),
    easContractAddress: getEasContractAddress(config) ?? "NOT_SET",
    readOnly,
    readOnlyReason,
  } as HypercertClientConfig;

  checkOnMissingValues(_config);

  return _config;
};

const checkOnMissingValues = (config: Partial<HypercertClientConfig>) => {
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      logger.warn(`Missing value in client config. ${key} is possibly undefined`);
    }
  }
};

const getChaindId = async (operator?: Operator) => {
  let chainId;
  if (!operator) {
    return undefined;
  } else if (ethers.providers.Provider.isProvider(operator)) {
    chainId = await operator.getNetwork().then((network) => network.chainId);
  } else {
    chainId = await operator.getChainId().then((chainId) => chainId);
  }

  return chainId;
};

const getGraphUrl = (config: Partial<HypercertClientConfig>) => {
  // Overrides determine Graph URL so skip the magic bits
  if (config.unsafeForceOverrideConfig) {
    return;
  }

  // If environment is "test" or "production" group the graph by environment
  if (config.environment === "test") {
    return { graphUrl: "test" };
  }

  if (config.environment === "production") {
    return { graphUrl: "production" };
  }
};

const getOperator = (config: Partial<HypercertClientConfig>) => {
  let operator: Operator;

  // If no operator is provided, we don't do anything
  if (!config.operator) {
    return undefined;
  }

  // Throw an error if the provided operator is not a Provider or Signer
  if (
    config.operator &&
    !ethers.providers.Provider.isProvider(config.operator) &&
    !ethers.Signer.isSigner(config.operator)
  ) {
    throw new InvalidOrMissingError("Invalid operator.", { operator: config.operator });
  }

  // Listen to network changes on the operator
  // When a Provider makes its initial connection, it emits a "network" event with a null oldNetwork along with the
  // newNetwork. So, if the oldNetwork exists, it represents a changing network
  if (ethers.Signer.isSigner(config.operator)) {
    operator = config.operator;
    operator?.provider?.on("network", (newNetwork, oldNetwork) => {
      if (typeof window === "undefined") return;
      if (oldNetwork && window.location) {
        window.location.reload();
      }
    });

    return { operator };
  } else if (ethers.providers.Provider.isProvider(config.operator)) {
    operator = config.operator;
    operator.on("network", (newNetwork, oldNetwork) => {
      if (typeof window === "undefined") return;
      if (oldNetwork && window.location) {
        window.location.reload();
      }
    });

    return { operator };
  }
};

export const getNftStorageToken = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.nftStorageToken) {
    return overrides.nftStorageToken;
  }

  if (process.env.NFT_STORAGE_TOKEN) {
    return process.env.NFT_STORAGE_TOKEN;
  }
};

export const getWeb3StorageToken = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.web3StorageToken) {
    return overrides.web3StorageToken;
  }

  if (process.env.WEB3_STORAGE_TOKEN) {
    return process.env.WEB3_STORAGE_TOKEN;
  }
};

const getEasContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  if (overrides.easContractAddress) {
    return overrides.easContractAddress;
  }
};
