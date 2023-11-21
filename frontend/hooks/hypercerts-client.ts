import React, { useEffect } from "react";

import { NFT_STORAGE_TOKEN, WEB3_STORAGE_TOKEN } from "../lib/config";
import { HypercertClient, HypercertClientConfig } from "@hypercerts-org/sdk";
import { useWalletClient, useNetwork } from "wagmi";

const clientConfig: Partial<HypercertClientConfig> = {
  chain: { id: 5 },
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
};

const defaultClient = new HypercertClient(clientConfig);

export const useHypercertClient = () => {
  const { chain } = useNetwork();

  const [client, setClient] = React.useState<HypercertClient>();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    data: walletClient,
    isError,
    isLoading: walletClientLoading,
  } = useWalletClient();

  useEffect(() => {
    if (chain?.id && !walletClientLoading && !isError && walletClient) {
      setIsLoading(true);

      try {
        const config: Partial<HypercertClientConfig> = {
          ...clientConfig,
          chain: { id: chain.id },
          walletClient,
        };

        const client = new HypercertClient(config);
        setClient(client);
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoading(false);
  }, [chain?.id, walletClient, walletClientLoading]);

  return { client, isLoading };
};
