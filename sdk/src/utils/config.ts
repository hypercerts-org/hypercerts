import { Environment, HypercertClientConfig, SupportedChainIds } from "../types";
import { logger } from "./logger";
import { DEFAULT_ENVIRONMENT, DEPLOYMENTS, ENDPOINTS } from "../constants";
import { createPublicClient, http } from "viem";

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
export const getConfig = (
  config: Partial<Pick<HypercertClientConfig, "publicClient" | "walletClient" | "environment">>,
) => {
  if (!config) throw new Error("Missing config");

  const _config = {
    ...getEnvironment(config),
    ...getWalletClient(config),
    ...getPublicClient(config),
    ...getGraphUrl(config),
    deployments: getDeploymentsForEnvironment(config.environment || DEFAULT_ENVIRONMENT),
    readOnly: true,
  };

  const chainId = _config.walletClient?.chain?.id;
  const writeAbleChainIds = Object.entries(_config.deployments).map(([_, deployment]) => deployment.chainId);

  if (!_config.walletClient) {
    logger.debug("Enabling read only mode: no walletClient provided", "getConfig", { config });
    _config.readOnly = true;
  }

  if (chainId && writeAbleChainIds.includes(chainId as SupportedChainIds)) {
    logger.debug("Disabling read only mode: connected chainId of supported chain", "getConfig", { chainId });
    _config.readOnly = false;
  }

  if (_config.walletClient && !_config.publicClient) {
    logger.debug("No public client found; substituting with default public client from viem", "getConfig");
    const chain = _config.walletClient.chain;
    _config.publicClient = createPublicClient({ chain, transport: http() });
  }

  return _config;
};

export const getDeploymentsForEnvironment = (environment: Environment) => {
  const deployments = Object.fromEntries(
    Object.entries(DEPLOYMENTS).filter(([_, deployment]) => {
      if (deployment.isTestnet && environment === "test") {
        return deployment;
      }

      if (!deployment.isTestnet && environment === "production") {
        return true;
      }

      return false;
    }),
  );

  if (!deployments) throw new Error("Missing deployments");

  return deployments;
};

export const getDeploymentsForChainId = (chainId: SupportedChainIds) => {
  logger.info("Indexer", "getDeploymentsForChainId", { chainId });

  const deployments = Object.fromEntries(
    Object.entries(DEPLOYMENTS).filter(([_, deployment]) => {
      if (deployment.chainId === chainId) {
        return deployment;
      }

      return false;
    }),
  );

  if (!deployments) throw new Error("Missing deployments");

  return deployments;
};

const getEnvironment = (config: Partial<HypercertClientConfig>) => {
  const environment = config.environment;

  if (!environment) throw new Error("Missing environment");
  if (!ENDPOINTS[environment])
    throw new Error(`Invalid environment ${environment}. [${Object.keys(ENDPOINTS).join(", ")}]`);

  return { environment };
};

const getGraphUrl = (config: Partial<HypercertClientConfig>) => {
  const environment = config.environment;

  if (!environment) throw new Error("Missing environment");
  if (!ENDPOINTS[environment])
    throw new Error(`Invalid environment ${environment}. [${Object.keys(ENDPOINTS).join(", ")}]`);

  return { graphUrl: `${ENDPOINTS[environment]}/v1/graphql` };
};

const getWalletClient = (config: Partial<HypercertClientConfig>) => {
  const walletClient = config.walletClient;

  if (!walletClient) {
    logger.debug("No wallet client found", "getWalletClient", walletClient);
  }

  return { walletClient };
};

const getPublicClient = (config: Partial<HypercertClientConfig>) => {
  return { publicClient: config.publicClient };
};
