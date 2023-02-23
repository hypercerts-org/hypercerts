import { Network } from "defender-base-client";

export interface NetworkConfig {
  networkKey: Network;
  contractAddress: string;
  supabaseTableName: string;
}

export const NETWORKS: NetworkConfig[] = [
  {
    networkKey: "goerli",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    supabaseTableName: "goerli-allowlistCache",
  },
  {
    networkKey: "optimism",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    supabaseTableName: "optimism-allowlistCache",
  },
];

/**
 * We'll use this to encode the network name into the Sentinel/Autotask name
 * We'll then subsequently use `getNetworkConfigFromName`
 * to extract the network name from within the Autotask
 * @param network
 * @param name - name pre-encoding
 * @returns
 */
export const encodeName = (network: NetworkConfig, name: string) =>
  `[${network.networkKey}] ${name}`;

/**
 * From an Autotask name, deduce which NetworkConfig we're using
 * @param name - name post-encoding
 */
export const getNetworkConfigFromName = (
  name: string,
): NetworkConfig | undefined => {
  for (let i = 0; i < NETWORKS.length; i++) {
    const network = NETWORKS[i];
    if (name.includes(`[${network.networkKey}]`)) {
      return network;
    }
  }
};
