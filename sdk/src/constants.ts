import { requireEnv } from "./utils/requireEnv.js";

type SupportedChains = "5" | "10";

type ChainConfig = {
  chainID: SupportedChains;
  name: "goerli" | "optimism-mainnet";
  rpc: string;
  graph: "hypercerts-testnet" | "hypercerts-optimism-mainnet";
};

export const DEFAULT_CHAIN_ID = requireEnv(process.env.DEFAULT_CHAIN_ID, "DEFAULT_CHAIN_ID") as SupportedChains;
export const RPC_URL = requireEnv(process.env.RPC_URL, "RPC_URL");

export const getChain = () => {
  let chain: ChainConfig;
  switch (DEFAULT_CHAIN_ID) {
    case "10": {
      chain = {
        chainID: DEFAULT_CHAIN_ID,
        name: "optimism-mainnet",
        rpc: RPC_URL,
        graph: "hypercerts-optimism-mainnet",
      };
      break;
    }
    case "5": {
      chain = {
        chainID: DEFAULT_CHAIN_ID,
        name: "goerli",
        rpc: RPC_URL,
        graph: "hypercerts-testnet",
      };
      break;
    }
    default:
      chain = {
        chainID: "5",
        name: "goerli",
        rpc: "https://rpc.ankr.com/eth_goerli",
        graph: "hypercerts-testnet",
      };
      break;
  }

  return chain;
};
