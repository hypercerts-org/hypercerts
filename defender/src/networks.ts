import { Network } from "@openzeppelin/defender-base-client";
import { deployments } from "@hypercerts-org/contracts";

export interface NetworkConfig {
  // Used to identify the network for both Alchemy and OpenZeppelin Sentinel
  networkKey: Network;
  // Minter contract address on the network
  hypercertMinterContractAddress: string;
  // Exchange contract address on the network
  hypercertExchangeContractAddress?: string;
  // the selector to retrieve the key from event.secrets in OpenZeppelin
  alchemyKeyEnvName?: string;
  // Chain ID for the network
  chainId: number;
  rpc?: string;
}

export const SUPABASE_ALLOWLIST_TABLE_NAME = "allowlistCache-chainId";

export interface SupportedNetworks {
  TEST: NetworkConfig[];
  PROD: NetworkConfig[];
}

export const NETWORKS: SupportedNetworks = {
  TEST: [
    {
      networkKey: "sepolia",
      hypercertMinterContractAddress:
        deployments["11155111"].HypercertMinterUUPS,
      hypercertExchangeContractAddress:
        deployments["11155111"].HypercertExchange,
      chainId: 11155111,
      rpc: "https://rpc.sepolia.org",
    },
  ],
  PROD: [
    {
      networkKey: "optimism",
      hypercertMinterContractAddress: deployments["10"].HypercertMinterUUPS,
      alchemyKeyEnvName: "ALCHEMY_OPTIMISM_KEY",
      chainId: 10,
    },
    {
      networkKey: "celo",
      hypercertMinterContractAddress: deployments["42220"].HypercertMinterUUPS,
      chainId: 42220,
      rpc: "https://forno.celo.org",
    },
  ],
};

/**
 * We'll use this to encode the network name into the Sentinel/Autotask name
 * We'll then subsequently use `getNetworkConfigFromName`
 * to extract the network name from within the Autotask
 * @param network
 * @param contract
 * @param name - name pre-encoding
 * @returns
 */
export const encodeName = (
  network: NetworkConfig,
  contract: "minter" | "exchange",
  name: string,
) => `[${network.networkKey}][${contract}] ${name}`;

export const decodeName = (
  encodedName: string,
): { networkKey: string; contract: string; name: string } => {
  const regex = /^\[(.+)\]\[(.+)\]\s(.+)$/;
  const match = encodedName.match(regex);
  if (!match) {
    throw new Error(`Invalid encoded name: ${encodedName}`);
  }
  const networkKey = match[1];
  const contract = match[2];
  const name = match[3];
  return { networkKey, contract, name };
};

/**
 * From an Autotask name, deduce which NetworkConfig we're using
 * @param name - name post-encoding
 */
export const getNetworkConfigFromName = (
  name: string,
): NetworkConfig | undefined => {
  const allNetworks = [...NETWORKS.TEST, ...NETWORKS.PROD];
  for (let i = 0; i < allNetworks.length; i++) {
    const network = allNetworks[i];
    if (name.includes(`[${network.networkKey}]`)) {
      return network;
    }
  }
};
