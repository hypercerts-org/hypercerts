import { useHypercertClient } from "./hypercerts-client";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { SupportedChainIds, HypercertMinterAbi } from "@hypercerts-org/sdk";
import { isAddress } from "viem";

export const useReadTransferRestrictions = (tokenId?: bigint) => {
  const { client } = useHypercertClient();
  const publicClient = usePublicClient();
  const { chain } = useAccount();

  return useQuery(
    ["read-transfer-restrictions", tokenId],
    async () => {
      if (!client) return null;
      if (!tokenId) return null;
      if (!publicClient) return null;

      const chainId = chain?.id;

      if (!chainId) return null;
      const deployments = client.getDeployments(chainId as SupportedChainIds);
      const contractAddress = deployments?.addresses?.HypercertMinterUUPS;

      if (!contractAddress || !isAddress(contractAddress.toLowerCase()))
        return null;

      return (await publicClient.readContract({
        abi: HypercertMinterAbi,
        address: contractAddress,
        functionName: "readTransferRestriction",
        args: [tokenId],
      })) as string;
    },
    { enabled: !!tokenId && !!client },
  );
};
