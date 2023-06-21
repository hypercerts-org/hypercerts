import React, { useEffect, useMemo } from "react";

import {
  DEFAULT_CHAIN_ID,
  NFT_STORAGE_TOKEN,
  WEB3_STORAGE_TOKEN,
  OVERRIDE_CHAIN_NAME,
  OVERRIDE_GRAPH_NAME,
  OVERRIDE_GRAPH_BASE_URL,
  OVERRIDE_GRAPH_NAMESPACE,
  CONTRACT_ADDRESS,
  UNSAFE_FORCE_OVERRIDE_CONFIG,
} from "../lib/config";
import { HypercertClient, HypercertClientConfig } from "@hypercerts-org/sdk";
import { ethers } from "ethers";
import { type WalletClient, useWalletClient, useNetwork } from "wagmi";

const clientConfig: Partial<HypercertClientConfig> = {
  chainId: DEFAULT_CHAIN_ID,
  nftStorageToken: NFT_STORAGE_TOKEN,
  web3StorageToken: WEB3_STORAGE_TOKEN,
};

function loadOverridingConfig(clientConfig: Partial<HypercertClientConfig>) {
  if (OVERRIDE_CHAIN_NAME) {
    clientConfig.chainName = OVERRIDE_CHAIN_NAME;
  }

  if (OVERRIDE_GRAPH_NAME) {
    clientConfig.graphName = OVERRIDE_GRAPH_NAME;
  }

  if (OVERRIDE_GRAPH_BASE_URL) {
    clientConfig.graphBaseUrl = OVERRIDE_GRAPH_BASE_URL;
  }

  if (OVERRIDE_GRAPH_NAMESPACE) {
    clientConfig.graphNamespace = OVERRIDE_GRAPH_NAMESPACE;
  }

  if (CONTRACT_ADDRESS) {
    clientConfig.contractAddress = CONTRACT_ADDRESS;
  }

  if (UNSAFE_FORCE_OVERRIDE_CONFIG) {
    clientConfig.unsafeForceOverrideConfig = UNSAFE_FORCE_OVERRIDE_CONFIG;
  }
}
loadOverridingConfig(clientConfig);

const defaultClient = new HypercertClient(clientConfig);

const walletClientToSigner = (walletClient: WalletClient) => {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
};

const useEthersSigner = ({ chainId }: { chainId?: number } = {}) => {
  const { data: walletClient } = useWalletClient({ chainId });
  return useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  );
};

export const useHypercertClient = () => {
  const { chain } = useNetwork();
  const signer = useEthersSigner({ chainId: chain?.id });

  const [client, setClient] = React.useState<HypercertClient>(defaultClient);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (chain?.id && signer) {
      setIsLoading(true);

        const config = {
          chainId,
          signer,
        };
        loadOverridingConfig(config);
        const client = new HypercertClient(config);
        setClient(client);
      }

      setIsLoading(false);
    }
  }, [chain?.id, signer]);

  return { client, isLoading };
};
