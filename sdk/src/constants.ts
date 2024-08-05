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
  421614: {
    chainId: 421614,
    addresses: deployments[421614],
    isTestnet: true,
  } as const,
};

export { ENDPOINTS, DEPLOYMENTS };
