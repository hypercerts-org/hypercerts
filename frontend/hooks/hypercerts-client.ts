import React, { useEffect } from "react";

import { HypercertClient, HypercertClientConfig } from "@hypercerts-org/sdk";
import { useWalletClient, useNetwork } from "wagmi";

const isSupportedChain = (chainId: number) => {
  const supportedChainIds = [10, 42220, 11155111, 84532, 8453]; // Replace with actual chain IDs

  return supportedChainIds.includes(chainId);
};
export const useHypercertClient = ({
  overrideChainId,
}: {
  overrideChainId?: number;
} = {}) => {
  const { chain } = useNetwork();
  const clientConfig = {
    chain: overrideChainId ? { id: overrideChainId } : chain,
  };
  const [client, setClient] = React.useState<HypercertClient | null>(() => {
    if (clientConfig.chain?.id && isSupportedChain(clientConfig.chain.id)) {
      return new HypercertClient(clientConfig);
    }
    return null;
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    data: walletClient,
    isError,
    isLoading: walletClientLoading,
  } = useWalletClient();

  useEffect(() => {
    const chainId = overrideChainId || chain?.id;
    if (
      chainId &&
      isSupportedChain(chainId) &&
      !walletClientLoading &&
      !isError &&
      walletClient
    ) {
      setIsLoading(true);

      try {
        const config: Partial<HypercertClientConfig> = {
          ...clientConfig,
          chain: { id: chainId },
          walletClient,
        };

        const client = new HypercertClient(config);
        setClient(client);
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoading(false);
  }, [chain?.id, overrideChainId, walletClient, walletClientLoading]);

  return { client, isLoading };
};
