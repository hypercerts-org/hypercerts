import { Environment, HypercertClientConfig, SupportedChainIds } from "../types";
import { logger } from "./logger";
import { DEFAULT_ENVIRONMENT, DEPLOYMENTS, ENDPOINTS } from "../constants";

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
export const getConfig = ({
  config = { environment: DEFAULT_ENVIRONMENT },
}: {
  config?: Partial<Pick<HypercertClientConfig, "publicClient" | "walletClient" | "environment">>;
}): HypercertClientConfig => {
  const _config = {
    // Let the user override from environment variables
    ...getEnvironment(config),
    ...getWalletClient(config),
    ...getPublicClient(config),
    ...getGraphUrl(config),
    deployments: getDeploymentsForEnvironment(config.environment || DEFAULT_ENVIRONMENT),
    readOnly: true,
  };

  const missingKeys = [];

  for (const [key, value] of Object.entries(_config)) {
    if (!value) {
      missingKeys.push(key);
    }
  }

  if (missingKeys.length > 0) logger.warn(`Missing properties in config: ${missingKeys.join(", ")}`);

  const chainId = _config.walletClient?.chain?.id as SupportedChainIds;
  const writeAbleChainIds = Object.entries(_config.deployments).map(([_, deployment]) => deployment.chainId);

  if (!chainId) {
    logger.warn("No chain ID found for wallet client", "getConfig", { chainId });
    _config.readOnly = true;
  }

  if (chainId && writeAbleChainIds.includes(chainId)) {
    console.log("Setting read only to false");
    _config.readOnly = false;
  }

  return _config;
};

export const getDeploymentsForEnvironment = (environment: Environment) => {
  logger.info("Indexer", "getDeploymentsForEnvironment", { environment });

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
  return { environment: config.environment || DEFAULT_ENVIRONMENT };
};

const getGraphUrl = (config: Partial<HypercertClientConfig>) => {
  return { graphUrl: `${ENDPOINTS[config.environment || DEFAULT_ENVIRONMENT]}/v1/graphql` };
};

const getWalletClient = (config: Partial<HypercertClientConfig>) => {
  const walletClient = config.walletClient;

  if (!walletClient) {
    logger.warn("No wallet client found", "getWalletClient", walletClient);
  }

  return { walletClient };
};

const getPublicClient = (config: Partial<HypercertClientConfig>) => {
  return { publicClient: config.publicClient };
};
