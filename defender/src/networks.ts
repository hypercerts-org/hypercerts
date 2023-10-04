import { Network } from "@openzeppelin/defender-base-client";

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

export interface SupportedNetworks {
  TEST: NetworkConfig[];
  PROD: NetworkConfig[];
}

export const NETWORKS: SupportedNetworks = {
  TEST: [
    {
      networkKey: "goerli",
      contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
      supabaseTableName: "allowlistCache-goerli",
      alchemyKeyEnvName: "ALCHEMY_GOERLI_KEY",
    },
    {
      networkKey: "sepolia",
      contractAddress: "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
      supabaseTableName: "allowlistCache-sepolia",
      alchemyKeyEnvName: "ALCHEMY_SEPOLIA_KEY",
    },
  ],
  PROD: [
    {
      networkKey: "optimism",
      contractAddress: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
      supabaseTableName: "allowlistCache-optimism",
      alchemyKeyEnvName: "ALCHEMY_OPTIMISM_KEY",
    },
  ],
};

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
  const allNetworks = [...NETWORKS.TEST, ...NETWORKS.PROD];
  for (let i = 0; i < allNetworks.length; i++) {
    const network = allNetworks[i];
    if (name.includes(`[${network.networkKey}]`)) {
      return network;
    }
  }
};
