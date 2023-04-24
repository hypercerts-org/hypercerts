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
  },
  10: {
    chainId: 10,
    chainName: "optimism-mainnet",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    graphName: "hypercerts-optimism-mainnet",
  },
};

export { DEFAULT_CHAIN_ID, DEPLOYMENTS };
