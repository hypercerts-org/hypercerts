import { useHypercertClient } from "./hypercerts-client";
import { useWalletClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { readContract } from "viem/actions";

export const useReadTransferRestrictions = (tokenId?: bigint) => {
  const { client } = useHypercertClient();
  const { data: walletClient } = useWalletClient();

  return useQuery(
    ["read-transfer-restrictions", tokenId],
    async () => {
      if (!client) return null;
      if (!tokenId) return null;
      if (!walletClient) return null;
      const contract = client.contract;

      if (!contract) return null;

      return (await readContract(walletClient, {
        ...contract,
        functionName: "readTransferRestriction",
        args: [tokenId],
      })) as string;
    },
    { enabled: !!tokenId && !!client },
  );
};
