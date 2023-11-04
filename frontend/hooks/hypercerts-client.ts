import React, { useEffect } from "react";

import {
  DEFAULT_CHAIN_ID,
  NFT_STORAGE_TOKEN,
  WEB3_STORAGE_TOKEN,
  CONTRACT_ADDRESS,
  UNSAFE_FORCE_OVERRIDE_CONFIG,
} from "../lib/config";
import { HypercertClient, HypercertClientConfig } from "@hypercerts-org/sdk";
import { useWalletClient, useNetwork } from "wagmi";

const clientConfig: Partial<HypercertClientConfig> = {
  id: DEFAULT_CHAIN_ID ? Number(DEFAULT_CHAIN_ID) : 5,
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
};

// TODO - make overrides explicit in loading config
function loadOverridingConfig(clientConfig: Partial<HypercertClientConfig>) {
  if (CONTRACT_ADDRESS) {
    clientConfig.contractAddress = CONTRACT_ADDRESS;
  }

  if (UNSAFE_FORCE_OVERRIDE_CONFIG) {
    clientConfig.unsafeForceOverrideConfig = UNSAFE_FORCE_OVERRIDE_CONFIG;
  }

  return clientConfig;
}

const defaultClient = new HypercertClient(loadOverridingConfig(clientConfig));

export const useHypercertClient = () => {
  const { chain } = useNetwork();

  const [client, setClient] = React.useState<HypercertClient>(defaultClient);
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
          id: chain.id,
          walletClient,
        };

        const client = new HypercertClient(loadOverridingConfig(config));
        setClient(client);
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoading(false);
  }, [chain?.id, walletClient, walletClientLoading]);

  return { client, isLoading };
};
