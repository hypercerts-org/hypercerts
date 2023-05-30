/**
 * Constants
 */

import { Deployment, SupportedChainIds } from "./types/client.js";

// Goerli is default if nothing specified
const DEFAULT_CHAIN_ID = 5;

// These are the deployments we manage
const DEPLOYMENTS: { [key in SupportedChainIds]: Deployment } = {
  5: {
    chainId: 5,
    chainName: "goerli",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    graphName: "hypercerts-testnet",
  } as const,
  10: {
    chainId: 10,
    chainName: "optimism-mainnet",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    graphName: "hypercerts-optimism-mainnet",
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

export { DEFAULT_CHAIN_ID, DEPLOYMENTS, EAS_SCHEMAS };
