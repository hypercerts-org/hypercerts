import { Signer, ethers } from "ethers";

import {
  ConfigurationError,
  HypercertClientConfig,
  InvalidOrMissingError,
  Operator,
  SupportedChainIds,
  UnsupportedChainError,
} from "../types";
import logger from "./logger";
import { deployments } from "../../src";
import { isAddress } from "ethers/lib/utils";

/**
 * Returns the configuration for the Hypercert client, based on the given overrides.
 * @param overrides An object containing overrides for the default configuration.
 * @returns The configuration for the Hypercert client.
 * @throws An `ConfigurationError` if the `environment` in `config` is not a supported environment, or if the chain ID was not found.
 * @dev 5, 10, 42220, 11155111 and "test", "production" are supported environments.
 * Test and production merge the Graphs by environment, while the chain IDs are specific to the chain.
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
    deployment = getDeployment(config.environment as SupportedChainIds);

    // If the config provided enables unsafeForceOverrideConfig, we can use that to get the deployment
    if (config.unsafeForceOverrideConfig) {
      deployment = { ...deployment, ...getDeploymentFromOverrides(config) };
    }

    if (!deployment) {
      throw new UnsupportedChainError(`No default config for environment=${config.environment} found in SDK`, {
        chainID: config.environment?.toString() || "undefined",
      });
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
  checkOnRequiredValues(_config);

  return _config;
};

/**
 * Returns the configuration for the Hypercert client, based on the given overrides.
 * @param overrides An object containing overrides for the default configuration.
 * @returns The configuration for the Hypercert client.
 * @throws An `ConfigurationError` if the `environment` in `config` is not a supported environment, or if the chain ID was not found.
 * @dev 5, 10, 42220, 11155111 and "test", "production" are supported environments.
 * Test and production merge the Graphs by environment, while the chain IDs are specific to the chain.
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

  // Need to get an provider for the writeable bits
  if (!config.operator || !ethers.Signer.isSigner(config.operator)) {
    throw new ConfigurationError("An operator must be provided to sign and submit transactions");
  }

  // If we know the chainID from the operator or the config, we can use that to get the deployment
  const chainId = await getChaindId(config?.operator);

  if (!chainId) {
    readOnly = true;
    readOnlyReason = "Could not get chainId from operator";
  }

  // If the chainId from environment and the operator are different, set to readOnly according to the environment chainID
  if (chainId && chainId !== config.environment) {
    deployment = getDeployment(config.environment as SupportedChainIds);
    readOnly = true;
    readOnlyReason = `ChainID mismatch between signer ${chainId} and configured environment ${config.environment}`;
  } else if (chainId && chainId === config.environment) {
    deployment = getDeployment(chainId as SupportedChainIds);
    readOnly = false;
    readOnlyReason = undefined;
  }

  // If the config provided enables unsafeForceOverrideConfig, we can use that to get the deployment
  if (config.unsafeForceOverrideConfig) {
    deployment = { ...deployment, ...getDeploymentFromOverrides(config) };
  }

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
  checkOnRequiredValues(_config);

  return _config;
};

const checkOnMissingValues = (config: Partial<HypercertClientConfig>) => {
  const allowMissing = ["easContractAddress", "readOnlyReason"];
  for (const [key, value] of Object.entries(config)) {
    if (!value && !allowMissing.includes(key)) {
      logger.warn(`Missing value in client config. ${key} is possibly undefined`);
    }
  }
};

const checkOnRequiredValues = (config: Partial<HypercertClientConfig>) => {
  const required = ["environment", "graphUrl"];
  for (const [key, value] of Object.entries(config)) {
    if (!value && required.includes(key)) {
      throw new InvalidOrMissingError(`Missing or incorrect ${key}`, Object.fromEntries([[key, value]]));
    }
  }
};

const getChaindId = async (operator?: Operator) => {
  let chainId;
  if (!operator) {
    return undefined;
  } else if (ethers.providers.Provider.isProvider(operator)) {
    chainId = await operator.getNetwork().then((network) => network.chainId);
  } else if (ethers.Signer.isSigner(operator)) {
    chainId = await (operator as Signer).getChainId().then((chainId) => chainId);
  }

  return chainId;
};

const getDeployment = (chainId: SupportedChainIds) => {
  return deployments[chainId];
};

const getDeploymentFromOverrides = (overrides: Partial<HypercertClientConfig>) => {
  let deployment;
  if (overrides.unsafeForceOverrideConfig) {
    if (!overrides.chainId || !overrides.chainName || !overrides.contractAddress || !overrides.graphUrl) {
      throw new InvalidOrMissingError(
        `attempted to override with chainId=${overrides.chainId}, but requires chainId, chainName, graphUrl, and contractAddress to be set`,
        {
          chainID: overrides.chainId,
          chainName: overrides.chainName,
          contractAddress: overrides.contractAddress,
          graphUrl: overrides.graphUrl,
        },
      );
    }

    if (!isAddress(overrides.contractAddress)) {
      throw new InvalidOrMissingError("Provided contract address in overrides is not an address", {
        contractAddress: overrides.contractAddress,
      });
    }

    try {
      new URL(overrides.graphUrl);
    } catch (e) {
      throw new InvalidOrMissingError("Provided graph URL in overrides is not a valid URL", {
        graphUrl: overrides.graphUrl,
      });
    }

    deployment = {
      chainId: overrides.chainId,
      chainName: overrides.chainName,
      contractAddress: overrides.contractAddress,
      graphUrl: overrides.graphUrl,
      unsafeForceOverrideConfig: overrides.unsafeForceOverrideConfig,
    };
  }

  return deployment;
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

  // Throw an error if the provided operator is not a Provider or Signer
  if (
    !config.operator &&
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
  return overrides.nftStorageToken;
};

export const getWeb3StorageToken = (overrides: Partial<HypercertClientConfig>) => {
  return overrides.web3StorageToken;
};

const getEasContractAddress = (overrides: Partial<HypercertClientConfig>) => {
  return overrides.easContractAddress;
};
