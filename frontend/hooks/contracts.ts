import { HypercertMinterABI } from "@hypercerts-org/hypercerts-sdk";
import { useContract, useProvider } from "wagmi";
import { CONTRACT_ADDRESS } from "../lib/config";

export const useHypercertContract = () => {
  const provider = useProvider();
  return useContract({
    address: CONTRACT_ADDRESS,
    abi: HypercertMinterABI,
    signerOrProvider: provider,
    // signerOrProvider: {
    //
    // }
    // staticProvider: {
    //   enable: true,
    //   chainId: DEFAULT_CHAIN_ID,
    // },
  });
};
