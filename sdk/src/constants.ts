/**
 * Constants
 */

import { Deployment, IndexerEnvironment, SupportedChainIds } from "./types";
import { deployments } from "@hypercerts-org/contracts";

const DEFAULT_GRAPH_BASE_URL = "https://staging-api.hypercerts.org/graphql";
export const DEFAULT_INDEXER_ENVIRONMENT: IndexerEnvironment = "all";

// The APIs we expose

// TODO when rolled out to production, enable both testing and prod environments
const APIS: { [key: string]: string } = {
  metadata: "https://staging-api.hypercerts.org/v1/metadata",
  allowlist: "https://staging-api.hypercerts.org/v1/allowlists",
};

// TODO when rolled out to production, enable both testing and prod environments with the correct URLs
export const GRAPHS: { [key in IndexerEnvironment]: string } = {
  all: "https://staging-api.hypercerts.org/graphql",
  test: "https://staging-api.hypercerts.org/graphql",
  production: "https://staging-api.hypercerts.org/graphql",
};

// These are the deployments we manage
const DEPLOYMENTS: { [key in SupportedChainIds]: Partial<Deployment> } = {
  10: {
    addresses: deployments[10],
    graphName: "hypercerts-optimism-mainnet",
    graphUrl: `${DEFAULT_GRAPH_BASE_URL}/hypercerts-optimism-mainnet`,
    isTestnet: false,
  } as const,
  42220: {
    addresses: deployments[42220],
    graphName: "hypercerts-celo",
    graphUrl: `${DEFAULT_GRAPH_BASE_URL}/hypercerts-celo`,
    isTestnet: false,
  },
  11155111: {
    addresses: deployments[11155111],
    graphName: "hypercerts-sepolia",
    graphUrl: DEFAULT_GRAPH_BASE_URL,
    isTestnet: true,
  } as const,
  84532: {
    addresses: deployments[84532],
    graphName: "hypercerts-base-sepolia",
    graphUrl: DEFAULT_GRAPH_BASE_URL,
    isTestnet: true,
  } as const,
  8453: {
    addresses: deployments[8453],
    graphName: "hypercerts-base-mainnet",
    graphUrl: `${DEFAULT_GRAPH_BASE_URL}/hypercerts-base-mainnet`,
    isTestnet: false,
  } as const,
};

// Example schema on Sepolia
// https://sepolia.easscan.org/schema/view/0xe542f797c9407ccb56e539d14c83718bf35c1d0f3c768bc2623aca56badfde51
const EAS_SCHEMAS = {
  sepolia: {
    duplicate: {
      uid: "0xe542f797c9407ccb56e539d14c83718bf35c1d0f3c768bc2623aca56badfde51",
      schema: "uint256 chainId, address contract, uint256 claimId",
    },
    contentHash: {
      uid: "0xdf4c41ea0f6263c72aa385580124f41f2898d3613e86c50519fc3cfd7ff13ad4",
      schema: "bytes32 contentHash",
    },
  },
} as const;

export { APIS, DEPLOYMENTS, EAS_SCHEMAS };
