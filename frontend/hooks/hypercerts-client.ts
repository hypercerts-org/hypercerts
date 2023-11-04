import React, { useEffect } from "react";

import {
  DEFAULT_CHAIN_ID,
  NFT_STORAGE_TOKEN,
  WEB3_STORAGE_TOKEN,
  OVERRIDE_GRAPH_URL,
  CONTRACT_ADDRESS,
  UNSAFE_FORCE_OVERRIDE_CONFIG,
} from "../lib/config";
import { HypercertClient, HypercertClientConfig } from "@hypercerts-org/sdk";
import { useWalletClient, useNetwork } from "wagmi";

const clientConfig: Partial<HypercertClientConfig> = {
  id: DEFAULT_CHAIN_ID,
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
};

function loadOverridingConfig(clientConfig: Partial<HypercertClientConfig>) {
  if (OVERRIDE_GRAPH_URL) {
    clientConfig.graphUrl = OVERRIDE_GRAPH_URL;
  }

  if (CONTRACT_ADDRESS) {
    clientConfig.contractAddress = CONTRACT_ADDRESS;
  }

  if (UNSAFE_FORCE_OVERRIDE_CONFIG) {
    clientConfig.unsafeForceOverrideConfig = UNSAFE_FORCE_OVERRIDE_CONFIG;
  }

  return clientConfig;
}

loadOverridingConfig(clientConfig);

const defaultClient = new HypercertClient(clientConfig);

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

      let config: Partial<HypercertClientConfig> = {
        id: chain.id,
        walletClient,
      };
      config = loadOverridingConfig(config);
      try {
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
