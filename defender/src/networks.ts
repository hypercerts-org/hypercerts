import { Network } from "defender-base-client";

export interface NetworkConfig {
  // Used to identify the network for both Alchemy and OpenZeppelin Sentinel
  networkKey: Network;
  // Contract address on the network
  contractAddress: string;
  // Table name in Supabase
  supabaseTableName: string;
  // the selector to retrieve the key from event.secrets in OpenZeppelin
  alchemyKeyEnvName: string;
}

export const NETWORKS: NetworkConfig[] = [
  {
    networkKey: "goerli",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    supabaseTableName: "goerli-allowlistCache",
    alchemyKeyEnvName: "ALCHEMY_GOERLI_KEY",
  },
  {
    networkKey: "optimism",
    contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
    supabaseTableName: "optimism-allowlistCache",
    alchemyKeyEnvName: "ALCHEMY_OPTIMISM_KEY",
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

export const decodeName = (
  encodedName: string,
): { networkKey: string; name: string } => {
  const regex = /^\[(.+)\]\s(.+)$/;
  const match = encodedName.match(regex);
  if (!match) {
    throw new Error(`Invalid encoded name: ${encodedName}`);
  }
  const networkKey = match[1];
  const name = match[2];
  return { networkKey, name };
};

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
