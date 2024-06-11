/**
 * Constants
 */

import { Deployment, Environment, SupportedChainIds } from "./types";
import { deployments } from "@hypercerts-org/contracts";

export const DEFAULT_ENVIRONMENT: Environment = "production";

// The APIs we expose

const ENDPOINTS: { [key: string]: string } = {
  test: "https://staging-api.hypercerts.org",
  production: "https://api.hypercerts.org",
};

// These are the deployments we manage
const DEPLOYMENTS: { [key in SupportedChainIds]: Deployment } = {
  10: {
    chainId: 10,
    addresses: deployments[10],
    isTestnet: false,
  } as const,
  42220: {
    chainId: 42220,
    addresses: deployments[42220],
    isTestnet: false,
  },
  8453: {
    chainId: 8453,
    addresses: deployments[8453],
    isTestnet: false,
  } as const,
  11155111: {
    chainId: 11155111,
    addresses: deployments[11155111],
    isTestnet: true,
  } as const,
  84532: {
    chainId: 84532,
    addresses: deployments[84532],
    isTestnet: true,
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

export { ENDPOINTS, DEPLOYMENTS, EAS_SCHEMAS };
