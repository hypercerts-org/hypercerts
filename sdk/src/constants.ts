import { requireEnv } from "./utils/requireEnv.js";

type SupportedChains = "5" | "10";

type ChainConfig = {
  chainID: SupportedChains;
  name: "goerli" | "optimism-mainnet";
  rpc: string;
  graph: "hypercerts-testnet" | "hypercerts-optimism-mainnet";
  address: string;
};

type StorageConfig = {
  nftStorage: string;
  web3Storage: string;
};

export const DEFAULT_CHAIN_ID = requireEnv(process.env.DEFAULT_CHAIN_ID, "DEFAULT_CHAIN_ID") as SupportedChains;
export const RPC_URL = requireEnv(process.env.RPC_URL, "RPC_URL");
export const CONTRACT_ADDRESS = requireEnv(process.env.CONTRACT_ADDRESS, "CONTRACT_ADDRESS");
export const NFT_STORAGE_TOKEN = requireEnv(process.env.NFT_STORAGE_TOKEN, "NFT_STORAGE_TOKEN");
export const WEB3_STORAGE_TOKEN = requireEnv(process.env.WEB3_STORAGE_TOKEN, "WEB3_STORAGE_TOKEN");

export const getChain = () => {
  let chain: ChainConfig;
  switch (DEFAULT_CHAIN_ID) {
    case "10": {
      chain = {
        chainID: DEFAULT_CHAIN_ID,
        name: "optimism-mainnet",
        rpc: RPC_URL,
        graph: "hypercerts-optimism-mainnet",
        address: CONTRACT_ADDRESS,
      };
      break;
    }
    case "5": {
      chain = {
        chainID: DEFAULT_CHAIN_ID,
        name: "goerli",
        rpc: RPC_URL,
        graph: "hypercerts-testnet",
        address: CONTRACT_ADDRESS,
      };
      break;
    }
    default:
      chain = {
        chainID: "5",
        name: "goerli",
        rpc: "https://rpc.ankr.com/eth_goerli",
        graph: "hypercerts-testnet",
        address: "0x822F17A9A5EeCFd66dBAFf7946a8071C265D1d07",
      };
      break;
  }

  return chain;
};

export const getStorage = (): StorageConfig => {
  return { nftStorage: NFT_STORAGE_TOKEN, web3Storage: WEB3_STORAGE_TOKEN };
};
