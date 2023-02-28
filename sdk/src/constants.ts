import { ethers } from "ethers";
import { requireEnv } from "./utils/requireEnv.js";

type SupportedChains = "5" | "10";

export type ChainConfig = {
  chainID: SupportedChains;
  name: "goerli" | "optimism-mainnet";
  rpc: string;
  graph: "hypercerts-testnet" | "hypercerts-optimism-mainnet";
  contractAddress: string;
};

export const CONTRACT_ADDRESS = requireEnv(process.env.CONTRACT_ADDRESS, "CONTRACT_ADDRESS");

export const getChainConfig = ({ chainID, rpc, contractAddress }: Partial<ChainConfig>) => {
  let chain: Partial<ChainConfig> = {};
  chain.chainID = chainID ? chainID : (process.env.DEFAULT_CHAIN_ID as SupportedChains);
  chain.rpc = rpc ? rpc : (process.env.RPC_URL as string);
  chain.contractAddress = contractAddress ? contractAddress : process.env.CONTRACT_ADDRESS || "";

  if (!ethers.utils.isAddress(chain.contractAddress)) {
    throw Error("Contract address not an address");
  }

  switch (chain.chainID) {
    case "10": {
      chain.name = "optimism-mainnet";
      chain.graph = "hypercerts-optimism-mainnet";
      break;
    }
    case "5": {
      chain.name = "goerli";
      chain.graph = "hypercerts-testnet";
      break;
    }
    default:
      break;
  }

  for (const [key, value] of Object.entries(chain)) {
    if (!value || value === undefined || value === "") {
      throw new Error(`Cannot get chain config. ${key} is possibly undefined`);
    }
  }

  return chain as ChainConfig;
};
