import { CONTRACT_ADDRESS } from "../lib/config";
import { HypercertMinterABI } from "@hypercerts-org/sdk";
import { useContract, useProvider } from "wagmi";

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
